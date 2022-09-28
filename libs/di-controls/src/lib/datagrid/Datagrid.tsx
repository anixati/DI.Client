import { ISchemaDef, ISelectedItem } from '@dotars/di-core';
import { ActionIcon, Center, Group, NativeSelect, Table, Text, TextInput } from '@mantine/core';
import React, { forwardRef, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { usePagination, useRowSelect, useSortBy, useTable } from 'react-table';
import { ChevronDown, ChevronUp, Refresh, Search, Selector } from 'tabler-icons-react';
import { getTableData, SortInfo } from './api';
import { DateCol, LinkCol, SelectBox } from './controls';
import { RenderPagingBar } from './PagingBar';
import { dataGridStyles } from './Styles';
import { ColList, SchemaContext, SchemaListRef } from './types';

export interface RenderTableProps {
  queryKey: string;
  schema: ISchemaDef;
  renderCmds?: () => ReactNode;
  entityId?: string;
  showHeader: boolean;
  cols: ColList;
  selectedIds:string[];
}

export const RenderDataGrid = forwardRef<SchemaListRef, RenderTableProps>((rx, ref) => {
  const { classes, cx } = dataGridStyles();
  const [pgSearch, setPgSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pgIndex, setPgIndex] = useState<number>(0);
  const [pgSize, setPgSize] = useState<number>(20);
  const [pgCount, setPgCount] = useState<number>(0);
  const [pgSort, setPgSort] = useState<Array<any>>([]);
  const [items, setItems] = useState<any[]>([]);
  //const hiddenColumns: Array<string> = [];
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

  const memoizedColumns = useMemo(() => {
    return rx.cols.cols;
  }, [rx.cols.cols]);

  const handlePreselect = () => {
    const rval: Record<string, boolean> = {} as Record<string, boolean>;
    if(rx.selectedIds && rx.selectedIds.length > 0)
    rx.selectedIds.forEach((val) => {
      rval[val] = true;
    });
    return rval;
  };

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
      initialState: { pageIndex: pgIndex, pageSize: pgSize, sortBy: pgSort, hiddenColumns: rx.cols.hc, selectedRowIds:handlePreselect() },
      getRowId: (row) => {
        return row.Id;
      },
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
    if (value && value.length > 0) setPgSearch(value);
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
      return rows.map((rx) => {
        return { value: rx['Id'], label: rx['Name'] };
      });
    }
    return null;
  };
  useImperativeHandle(ref, () => ({ refresh, getSelectedRow, getSelectedRows }));

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    changeSchema?.(value);
  };
  //const [selValue, setSelValue] = useState('');
  return (
    <div className={classes.datagrid}>
      <div className={classes.dgHeader}>
        <Group spacing="sm" position="apart">
          <Group position="left">
            {rx.showHeader === true && (
              <>
                {mode === 'DEFAULT' && <NativeSelect data={schemas} variant="unstyled" value={schema} onChange={handleSelectChange} style={{ width: 310 }} />}
                {mode !== 'DEFAULT' && <Text weight={500}>{rx.schema.title}</Text>}
              </>
            )}
          </Group>
          <Group position="right" spacing={3}>
            <TextInput size="xs" placeholder="Search" icon={<Search size={14} />} onChange={handleSearchChange} />
            <ActionIcon variant="filled" color="cyan" onClick={refresh}>
              <Refresh size={16} />
            </ActionIcon>
            {rx.renderCmds && rx.renderCmds()}
          </Group>
        </Group>
      </div>
      <div className={classes.dgContent}>
        <Table sx={{ padding: 5 }} {...getTableProps()} verticalSpacing={6} fontSize="xs" horizontalSpacing={10} striped highlightOnHover>
          <thead className={classes.tableheader}>
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
                            {column.Header !== '' && <Center className={classes.tableicon}>{column.isSorted ? column.isSortedDesc ? <ChevronUp size={14} color="blue" /> : <ChevronDown size={14} color="blue" /> : ''}</Center>}
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
      </div>
      <div className={classes.dgFooter}>{RenderPagingBar({ pageLength: pageOptions.length, canPreviousPage, canNextPage, pageIndex, pageSize, pageCount, setPageSize, nextPage, previousPage, gotoPage })}</div>
    </div>
  );
});
