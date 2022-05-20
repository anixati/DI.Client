import { IEntity, IGenericListResponse } from '@dotars/di-core';
import { Center, Group, Table } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Column, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { AlertOctagon, ChevronDown, ChevronUp, Selector } from 'tabler-icons-react';
import { ScrollContent } from '../../panels';
import { SearchCmdBar } from '../controls/CmdBar';
import { dataUiStyles } from '../Styles';
import { PagingBar } from './PagingBar';

interface PagedTableProps<T extends IEntity> {
  title: string;
  baseUrl: string;
  canCreate?: boolean;
  columns: Array<Column<T>>;
  OnCreate: () => void;
}

export function PagedTable<T extends IEntity>({ columns, title, baseUrl, OnCreate, canCreate, ...rest }: PagedTableProps<T>): ReactElement {
  const { classes, cx } = dataUiStyles();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [itemIdx, setitemIdx] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(20);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const fetchData = useCallback(async ({ pageIndex, pageSize }) => {
    try {
      setLoading(true);
      const resp = await axios.post<IGenericListResponse<T>>(baseUrl, { index: pageIndex, size: pageSize });
      if (resp.data?.result?.items) {
        setitemIdx(pageIndex);
        setItemCount(resp.data.result?.pageCount);
        setItems(resp.data?.result?.items);
      } else {
        if (resp.data.failed) {
          showNotification({ message: `${resp.data.messages}`, color: 'red', icon: <AlertOctagon /> });
          setItems([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setGlobalFilter,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { globalFilter, pageIndex, pageSize },
  } = useTable<T>({ columns: memoizedColumns, data: items, initialState: { pageIndex: itemIdx }, manualPagination: true, pageCount: itemCount }, useGlobalFilter, useSortBy, usePagination);

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  const [search, setSearch] = useState(globalFilter);
  const OnSearch = (val: string) => {
    setSearch(val);
    setGlobalFilter(val || undefined);
  };
  const OnRefresh = () => {
    fetchData({ pageIndex, pageSize });
  };

  // Render the UI for your table
  return (
    <div className={classes.ptCard}>
      <div className={classes.ptheader}>
        <SearchCmdBar title={title} searchStr={search} OnSearch={OnSearch} OnRefresh={OnRefresh} OnCreate={OnCreate} canCreate={canCreate} />
      </div>
      <ScrollContent
        loading={loading}
        content={(scrolled) => (
          <Table sx={{}} {...getTableProps()} verticalSpacing={2} fontSize="xs" horizontalSpacing={2} striped highlightOnHover>
            <thead className={cx(classes.tableheader, { [classes.scrolled]: scrolled })}>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())} className={classes.tableTh}>
                      <Group position="left" spacing={4}>
                        {column.render('Header')}
                        {column.Header !== '' && <Center className={classes.tableicon}>{column.isSorted ? column.isSortedDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} /> : <Selector size={14} />}</Center>}
                      </Group>
                    </th>
                  ))}
                </tr>
              ))}
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
      <div className={classes.ptFooter}>{PagingBar({ pageLength: pageOptions.length, canPreviousPage, canNextPage, pageIndex, pageSize, pageCount, setPageSize, nextPage, previousPage, gotoPage })}</div>
    </div>
  );
}
