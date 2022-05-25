import { getErrorMsg, IDataResponse, IGenericListResponse, ISchemaDef, ITableDef } from '@dotars/di-core';
import { Alert, Center, Group, LoadingOverlay, Table } from '@mantine/core';
import axios from 'axios';
import { ReactElement, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { usePagination, useSortBy, useTable } from 'react-table';
import { ChevronDown, ChevronUp, Selector } from 'tabler-icons-react';
import { ScrollContent } from '../../panels';
import { TableCmdBar } from '../controls';
import { dataUiStyles } from '../Styles';
import { RenderPagingBar } from './PagingBar';

export interface RenderTableProps {
  queryKey: string;
  schema: ISchemaDef;
  renderCmds?: () => ReactNode;
}

type SortInfo = {
  id: string;
  desc: boolean;
};

function RenderDataGrid(rx: RenderTableProps): ReactElement {
  const { classes, cx } = dataUiStyles();
  const [pgSearch, setPgSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pgIndex, setPgIndex] = useState<number>(0);
  const [pgSize, setPgSize] = useState<number>(20);
  const [pgCount, setPgCount] = useState<number>(0);
  const [pgSort, setPgSort] = useState<Array<any>>([]);
  const [items, setItems] = useState<any[]>([]);
  //const [{pgIndex, pgSize, pgSearch, pgSort}, SetState] = useState<TableState>(initialState);
  const QueryKey = `${rx.queryKey}`;
  const fetchData = useCallback(async (index: number, size: number) => {
    try {
      setLoading(true);
      console.log('loading ... ', index, size);
      let sortBy: Array<SortInfo> = [];
      if (pgSort.length > 0) {
        sortBy = pgSort.map((x) => ({ id: x.id, desc: x.desc } as SortInfo));
      }
      const resp = await axios.post<IGenericListResponse<any>>(`/qry/schema/${QueryKey}`, { index, size, sortBy,SearchStr:pgSearch });
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
  }, [QueryKey,pgSort,pgSearch]);

  const memoizedColumns = useMemo(() => {
    return rx.schema.columns.map((x) => ({ Header: x.Header, accessor: x.accessor, width: x.width }));
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
  } = useTable<any>({ columns: memoizedColumns, data: items, initialState: { pageIndex: pgIndex, pageSize: pgSize, sortBy: pgSort }, manualPagination: true, pageCount: pgCount }, useSortBy, usePagination);

  useEffect(() => {
    fetchData(pageIndex, pageSize);
  }, [fetchData, pageIndex, pageSize, pgSearch, pgSort]);

  // useEffect(() => {
  //   fetchData(pageIndex, pageSize, pgSearch, pgSort);
  //   gotoPage(0);
  // }, [fetchData, pageSize, gotoPage]);

  useEffect(() => {
    if (sortBy && sortBy.length > 0) {
      setPgSort(sortBy);
    }
  }, [sortBy]);

  // useEffect(() => {
  //   if (pgSearch && pgSearch.length > 3) {
  //     fetchData(pageIndex, pageSize);
  //   }
  // }, [pgSearch, fetchData]);

  const OnSearch = (val: string) => {
    if (val && val.length > 3) setPgSearch(val); else setPgSearch('')
  };

  const OnRefresh = () => {
    fetchData(pageIndex, pageSize);
  };

  return (
    <div className={classes.ptCard}>
      <div className={classes.ptheader}>
        <TableCmdBar title={rx.schema.title}  OnSearch={OnSearch} OnRefresh={OnRefresh} renderCmds={rx.renderCmds} />
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
                          <Group position="left" spacing={4}>
                            {column.render('Header')}
                            {column.Header !== '' && <Center className={classes.tableicon}>{column.isSorted ? column.isSortedDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} /> : <Selector size={14} />}</Center>}
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

//---------------------------------------------------------------------------------------------------------------
export interface SchemaTableProps {
  schemaName: string;
  renderCmds?: () => ReactNode;
}

export const SchemaTable: React.FC<SchemaTableProps> = (rx) => {
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

      {isSuccess && <RenderDataGrid queryKey={rx.schemaName} schema={data} renderCmds={rx.renderCmds} />}
    </>
  );
};
