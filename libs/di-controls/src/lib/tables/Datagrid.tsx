import { getErrorMsg, IColumnDef, IDataResponse, IGenericListResponse, ISchemaDef, ITableDef } from '@dotars/di-core';
import { ActionIcon, Alert, Anchor, Box, Center, Group, LoadingOverlay, NativeSelect, SelectItem, Table, TextInput } from '@mantine/core';
import axios from 'axios';
import { createContext, forwardRef, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { CellProps, Column, usePagination, useSortBy, useTable } from 'react-table';
import { ChevronDown, ChevronUp, Refresh, Search, Selector } from 'tabler-icons-react';
import { ScrollContent } from '../panels';
import { dataUiStyles } from '../styles/Styles';
import { RenderPagingBar } from './PagingBar';

export interface SchemaListRef {
  refresh(): void;
}
export interface RenderTableProps {
  queryKey: string;
  schema: ISchemaDef;
  renderCmds?: () => ReactNode;
}

type SortInfo = {
  id: string;
  desc: boolean;
};

const LinkCol = (def: IColumnDef): Column<any> => {
  return {
    Header: `${def.Header}`,
    id: `${def.accessor}-link`,
    accessor: `${def.accessor}`,
    Cell: ({ row }: CellProps<any>) => (
       <Anchor component={Link} to={`${row.original['Id']}`} size="xs">
        {row.original[def.accessor]}
      </Anchor>
    ),
  };
};


export const RenderDataGrid = forwardRef<SchemaListRef, RenderTableProps>((rx, ref) => {
//function RenderDataGrid(rx: RenderTableProps): ReactElement {
  const { classes, cx } = dataUiStyles();
  const [pgSearch, setPgSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pgIndex, setPgIndex] = useState<number>(0);
  const [pgSize, setPgSize] = useState<number>(20);
  const [pgCount, setPgCount] = useState<number>(0);
  const [pgSort, setPgSort] = useState<Array<any>>([]);
  const [items, setItems] = useState<any[]>([]);
  const hiddenColumns: Array<string> = [];
  //const [{pgIndex, pgSize, pgSearch, pgSort}, SetState] = useState<TableState>(initialState);
  const QueryKey = `${rx.queryKey}`;
  const fetchData = useCallback(
    async (index: number, size: number) => {
      try {
        setLoading(true);
        let sortBy: Array<SortInfo> = [];
        if (pgSort.length > 0) {
          sortBy = pgSort.map((x) => ({ id: x.id, desc: x.desc } as SortInfo));
        }
        const resp = await axios.post<IGenericListResponse<any>>(`/qry/schema/${QueryKey}`, { index, size, sortBy, SearchStr: pgSearch });
        if (resp.data?.result) {
          const rs = resp.data?.result;
          setPgIndex(rs.pageIndex);
          setPgSize(rs.pageSize);
          setPgCount(rs.pageCount);
          setItems(resp.data?.result?.items);
        } else throw new Error(`Failed to retrive `);
      } catch (ex) {
        throw new Error(`API error:${getErrorMsg(ex)}`);
      } finally {
        setLoading(false);
      }
    },
    [QueryKey, pgSort, pgSearch]
  );

  const memoizedColumns = useMemo(() => {
    const colList = rx.schema.columns.map((x) => {
      if (x.type === 1) hiddenColumns.push(x.accessor);
      if (x.type === 2) {
        hiddenColumns.push(x.accessor);
        return LinkCol(x);
      } else {
        return { Header: x.Header, accessor: x.accessor, width: x.width };
      }
    });
    //TODO: --- fix duplicate issue
    return colList;
  }, [rx.schema]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
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
    state: { sortBy, pageIndex, pageSize },
  } = useTable<any>({ columns: memoizedColumns, data: items, initialState: { pageIndex: pgIndex, pageSize: pgSize, sortBy: pgSort, hiddenColumns }, manualPagination: true, pageCount: pgCount }, useSortBy, usePagination);

  useEffect(() => {
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
  useImperativeHandle(ref, ()=>({refresh}));

  const { schema, schemas, changeSchema } = useContext(SchemaContext);
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
            <Group spacing="sm" position="left">
              <NativeSelect data={schemas} variant="filled" value={schema} onChange={handleSelectChange} style={{ width: 310 }} />
            </Group>
            <Group position="right" spacing={3}>
              <TextInput size="xs" placeholder="Search" icon={<Search size={14} color="#071E3E" />} onChange={handleSearchChange} />
              <ActionIcon variant="filled" color="dotars" onClick={refresh}>
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
}
);

//---------------------------------------------------------------------------------------------------------------
export interface SchemaTableProps {
  schemaName: string;
  renderCmds?: () => ReactNode;
}

export const SchemaTable = forwardRef<SchemaListRef, SchemaTableProps>((rx, ref) => {
  const fetchData = async () => {
    try {
      const rsp = await axios.get<IDataResponse<ITableDef>>(`/qry/schema/${rx.schemaName}`);
      if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
      if (rsp.data?.result?.schema) return rsp.data.result.schema;
      throw new Error(`Failed to retrive `);
    } catch (ex) {
      throw new Error(`API error:${getErrorMsg(ex)}`);
    }
  };
  const { isLoading, error, data, isSuccess } = useQuery([rx.schemaName], () => fetchData(), { keepPreviousData: false, staleTime: Infinity });

  return (
    <>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && <RenderDataGrid ref={ref} queryKey={rx.schemaName} schema={data} renderCmds={rx.renderCmds} />}
    </>
  );
});
//---------------------------------------------------------------------------------------------------------------

interface ISchemaContext {
  schema: string;
  schemas: Array<SelectItem>;
  changeSchema?: (name: string) => void;
}
const SchemaContext = createContext<ISchemaContext>({ schema: '', schemas: [] });
export interface SchemaListTableProps {
  schemas: Array<SelectItem>;
  renderCmds?: () => ReactNode;
}

export const SchemaListTable = forwardRef<SchemaListRef, SchemaListTableProps>((rx, ref) => {
  const [schema, setSchema] = useState<string>(rx.schemas[0].value);
  const [schemas] = useState<Array<SelectItem>>(rx.schemas);

  const changeSchema = (name: string) => {
    setSchema(name);
  };
  return (
    <SchemaContext.Provider value={{ schema, schemas, changeSchema }}>
      <SchemaTable ref={ref} schemaName={schema} />
    </SchemaContext.Provider>
  );
});
