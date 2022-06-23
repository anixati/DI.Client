import { getErrorMsg, IColumnDef, ISchemaDef, ISelectedItem } from '@dotars/di-core';
import { ActionIcon, Alert, Anchor, Box, Center, Checkbox, Group, LoadingOverlay, NativeSelect, SelectItem, Table, Text, TextInput } from '@mantine/core';
import moment from 'moment';
import React, { createContext, forwardRef, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CellProps, Column, usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { ChevronDown, ChevronUp, PhoneCalling, Refresh, Search, Selector } from 'tabler-icons-react';
import { ScrollContent } from '../panels';
import { dataUiStyles } from '../styles/Styles';
import { getTableData, getTableSchema, SortInfo } from './api';
import { RenderPagingBar } from './PagingBar';

//---------------------------------------------CONTEXT------------------------------------------------------------------
export type RenderMode = 'DEFAULT' | 'LOOKUP' | 'SUBGRID' | 'MULTISELECT';
interface ISchemaContext {
  mode: RenderMode;
  schema: string;
  schemas: Array<SelectItem>;
  changeSchema?: (name: string) => void;
}
const SchemaContext = createContext<ISchemaContext>({ mode: 'DEFAULT', schema: '', schemas: [] });

//------------------------------------------------  MAIN---------------------------------------------------------------
export interface SchemaListTableProps {
  schemas: Array<SelectItem>;
  renderCmds?: () => ReactNode;
  mode?: RenderMode;
  showHeader?: boolean;
}
export const SchemaListTable = forwardRef<SchemaListRef, SchemaListTableProps>((rx, ref) => {
  const [schema, setSchema] = useState<string>(rx.schemas[0].value);
  const [schemas] = useState<Array<SelectItem>>(rx.schemas);
  const [mode, setMode] = useState<RenderMode>(rx.mode ? rx.mode : 'DEFAULT');
  const { entityId } = useParams();
  useEffect(() => {
    if (rx.mode && rx.mode === 'SUBGRID' && (entityId === undefined || entityId.length <= 0)) throw new Error('Subgrid must have valid entity id');
  }, [rx.mode, entityId]);
  const changeSchema = (name: string) => {
    setSchema(name);
  };
  return (
    <SchemaContext.Provider value={{ mode, schema, schemas, changeSchema }}>
      <SchemaTable ref={ref} schemaName={schema} renderCmds={rx.renderCmds} entityId={entityId} showHeader={rx.showHeader !== undefined ? rx.showHeader : true} />
    </SchemaContext.Provider>
  );
});

//--------------------------------------------------TYPES-------------------------------------------------------------

export interface SchemaListRef {
  refresh(): void;
  getSelectedRow(): ISelectedItem | null;
  getSelectedRows(): Array<ISelectedItem> | null;
}

//----------------------------------------------------SCHEMA LOADER-----------------------------------------------------------
export interface SchemaTableProps {
  schemaName: string;
  renderCmds?: () => ReactNode;
  entityId?: string;
  showHeader: boolean;
}

export const SchemaTable = forwardRef<SchemaListRef, SchemaTableProps>((rx, ref) => {
  const { isLoading, error, data, isSuccess } = useQuery([rx.schemaName], async () => await getTableSchema(rx.schemaName), { keepPreviousData: false, staleTime: 0 });
  return (
    <>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && data && <RenderDataGrid ref={ref} queryKey={rx.schemaName} schema={data} renderCmds={rx.renderCmds} entityId={rx.entityId} showHeader={rx.showHeader} />}
    </>
  );
});

//----------------------------------------------CONTROLS-----------------------------------------------------------------

/* #region  Row select control */
interface IIndeterminateInputProps {
  indeterminate?: boolean;
  name: string;
}
const SelectBox = forwardRef<HTMLInputElement, IIndeterminateInputProps>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef(null);
  const resolvedRef: any = ref || defaultRef;
  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return <Checkbox color="dotars" radius="xs" size="xs" ref={resolvedRef} {...rest} />;
});

/* #endregion */

//---------------------------------------------------COLUMNS------------------------------------------------------------

const LinkCol = (def: IColumnDef, pathname: string): Column<any> => {
  //  const rp = def.linkPath ? `/${def.linkPath}` : `${pathname}/`;
  return {
    Header: `${def.Header}`,
    id: `${def.accessor}-link`,
    accessor: `${def.accessor}`,
    Cell: ({ row }: CellProps<any>) => (
      <Anchor component={Link} to={`${def.linkPath}/${row.original[def.linkId]}`} size="xs" color="cyan" variant="text">
        {row.original[def.accessor]}
      </Anchor>
    ),
  };
};

const DateCol = (def: IColumnDef): Column<any> => {
  //  const rp = def.linkPath ? `/${def.linkPath}` : `${pathname}/`;
  return {
    Header: `${def.Header}`,
    id: `${def.accessor}-date`,
    accessor: `${def.accessor}`,
    Cell: (props) => {
      return moment(props.value).local().format('DD/MM/YYYY');
    },
  };
};

//---------------------------------------------------------------------------------------------------------------

export interface RenderTableProps {
  queryKey: string;
  schema: ISchemaDef;
  renderCmds?: () => ReactNode;
  entityId?: string;
  showHeader: boolean;
}

export const RenderDataGrid = forwardRef<SchemaListRef, RenderTableProps>((rx, ref) => {
  const { classes, cx } = dataUiStyles();
  const [pgSearch, setPgSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pgIndex, setPgIndex] = useState<number>(0);
  const [pgSize, setPgSize] = useState<number>(20);
  const [pgCount, setPgCount] = useState<number>(0);
  const [pgSort, setPgSort] = useState<Array<any>>([]);
  const [items, setItems] = useState<any[]>([]);
  const hiddenColumns: Array<string> = [];
  const { mode, schema, schemas, changeSchema } = useContext(SchemaContext);
  const schemaKey = `${rx.queryKey}`;

  const fetchData = useCallback(
    async (index: number, size: number) => {
      try {
        setLoading(true);
        let SortBy: Array<SortInfo> = [];
        if (pgSort.length > 0) {
          SortBy = pgSort.map((x) => ({ id: x.id, desc: x.desc } as SortInfo));
        }
        const resp = await getTableData({ schemaKey, index, size, SortBy, entityId: rx.entityId, SearchStr: pgSearch });
        if (resp) {
          setPgIndex(resp.pageIndex);
          setPgSize(resp.pageSize);
          setPgCount(resp.pageCount);
          setItems(resp.items);
        }
      } finally {
        setLoading(false);
      }
    },
    [schemaKey, pgSort, pgSearch]
  );

  const location = useLocation();
  const memoizedColumns = useMemo(() => {
    let colList = rx.schema.columns.map((x) => {
      if (x.type === 1) hiddenColumns.push(x.accessor);
      if (x.type === 2) {
        hiddenColumns.push(x.accessor);
        return LinkCol(x, location.pathname);
      }
      if (x.type === 3) {
        hiddenColumns.push(x.accessor);
        return DateCol(x);
      }
      return { Header: x.Header, accessor: x.accessor, width: x.width };
    });
    //TODO: --- fix duplicate issue
    if (mode === 'LOOKUP') {
      colList = [
        {
          id: 'selection',
          accessor: `id`,
          Header: '', //({ getToggleAllRowsSelectedProps }) => <div></div>,
          Cell: ({ row }) => <SelectBox name={''} {...row.getToggleRowSelectedProps()} />,
        },
        ...colList,
      ];
    }
    return colList;
  }, [rx.schema.columns, mode]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    selectedFlatRows,
    //setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { sortBy, pageIndex, pageSize, selectedRowIds },
  } = useTable<any>(
    {
      columns: memoizedColumns,
      data: items,
      stateReducer: (newState, action) => {
        if (mode === 'LOOKUP') {
          if (action.type === 'toggleRowSelected') {
            newState.selectedRowIds = {
              [action['id']]: true,
            };
          }
        }
        return newState;
      },
      initialState: { pageIndex: pgIndex, pageSize: pgSize, sortBy: pgSort, hiddenColumns },
      manualPagination: true,
      pageCount: pgCount,
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      if (mode === 'MULTISELECT') {
        hooks.visibleColumns.push((columns) => [
          {
            id: 'selection',
            Header: ({ getToggleAllPageRowsSelectedProps }) => (
              <div>
                <SelectBox name={''} {...getToggleAllPageRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <SelectBox name={''} {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    }
  );

  useEffect(() => {
  //  console.log('callling fetch')
    fetchData(pageIndex, pageSize);
  }, [fetchData, pageIndex, pageSize, pgSearch, pgSort]);

  useEffect(() => {
    if (sortBy && sortBy.length > 0) {
      setPgSort(sortBy);
    }
  }, [sortBy]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    if (value && value.length > 3) setPgSearch(value);
    else setPgSearch('');
  };
  const refresh = () => {
    fetchData(pageIndex, pageSize);
  };

  const getSelectedRow = (): ISelectedItem | null => {
    const rows = selectedFlatRows.map((d) => d.original);
    if (rows && rows.length > 0) {
      const rx = rows[0];
      return { value: rx['Id'], label: rx['Name'] };
    }
    return null;
  };
  
  const getSelectedRows = (): Array<ISelectedItem> | null => {
    const rows = selectedFlatRows.map((d) => d.original);
    if (rows && rows.length > 0) {
      return rows.map((rx)=> {return { value: rx['Id'], label: rx['Name'] }});
    }
    return null;
  };
  useImperativeHandle(ref, () => ({ refresh, getSelectedRow,getSelectedRows }));

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    changeSchema?.(value);
  };
  //const [selValue, setSelValue] = useState('');
  return (
    <div className={classes.ptCard}>
      <div className={classes.ptheader}>
        <Box>
          <Group spacing="sm" position="apart">
            {' '}
            <Group spacing="sm" position="left">
              {rx.showHeader === true && (
                <>
                  {mode === 'DEFAULT' && <NativeSelect data={schemas} variant="filled" value={schema} onChange={handleSelectChange} style={{ width: 310 }} />}
                  {mode !== 'DEFAULT' && <Text weight={500}>{rx.schema.title}</Text>}
                </>
              )}{' '}
            </Group>
            <Group position="right" spacing={3}>
              <TextInput size="xs" placeholder="Search" icon={<Search size={14} />} onChange={handleSearchChange} />
              <ActionIcon variant="filled" color="cyan" onClick={refresh}>
                <Refresh size={16} />
              </ActionIcon>
              {rx.renderCmds && rx.renderCmds()}
            </Group>
          </Group>
        </Box>
      </div>
      <ScrollContent
        loading={loading}
        content={(scrolled) => (
          <Table sx={{}} {...getTableProps()} verticalSpacing={2} fontSize="xs" horizontalSpacing={2} striped highlightOnHover>
            <thead className={cx(classes.tableheader, { [classes.scrolled]: scrolled })}>
              {headerGroups.map((headerGroup) => {
                return (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => {
                      return (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className={classes.tableTh}>
                          <Group position="apart">
                            <Group position="left" spacing={4}>
                              {column.render('Header')}
                            </Group>
                            <Group position="right" spacing={4}>
                              {column.Header !== '' && <Center className={classes.tableicon}>{column.isSorted ? column.isSortedDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} /> : <Selector size={14} />}</Center>}
                            </Group>
                          </Group>
                        </th>
                      );
                    })}
                  </tr>
                );
              })}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      />
      <div className={classes.ptFooter}>{RenderPagingBar({ pageLength: pageOptions.length, canPreviousPage, canNextPage, pageIndex, pageSize, pageCount, setPageSize, nextPage, previousPage, gotoPage })}</div>
    </div>
  );
});
