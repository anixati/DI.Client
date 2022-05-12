import { IEntity, IGenericListResponse } from '@dotars/di-core';
import { ActionIcon, Card, Center, Group, LoadingOverlay, NativeSelect, NumberInput, ScrollArea, Table, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import { Column, useGlobalFilter, usePagination, useSortBy, useTable } from 'react-table';
import { AlertOctagon, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Selector } from 'tabler-icons-react';
import { SearchCmdBar } from '../controls/CmdBar';
import { dataUiStyles } from '../Styles';

interface PagedTableProps<T extends IEntity> {
  title: string;
  baseUrl: string;
  canCreate?: boolean;
  columns: Array<Column<T>>;
  OnCreate: () => void;
}

export function PagedTable<T extends IEntity>({ columns, title, baseUrl, OnCreate, canCreate, ...rest }: PagedTableProps<T>): ReactElement {
  const { classes, cx } = dataUiStyles();
  const [scrolled, setScrolled] = useState(false);
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
    <Card withBorder p="lg" className={classes.card}>
      <Card.Section className={classes.header}>
        <SearchCmdBar title={title} searchStr={search} OnSearch={OnSearch} OnRefresh={OnRefresh} OnCreate={OnCreate} canCreate={canCreate} />
      </Card.Section>
      <Card.Section className={classes.content}>
        <LoadingOverlay visible={loading} />
        <ScrollArea sx={{ height: 350, paddingRight: 20 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
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
        </ScrollArea>
      </Card.Section>
      <Card.Section className={classes.footer}>
        <Group spacing="sm" position="apart">
          <Group spacing={2} position="left">
            <ActionIcon variant="light" color="indigo" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              <ChevronsLeft size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="indigo" onClick={() => previousPage()} disabled={!canPreviousPage}>
              <ChevronLeft size={16} />
            </ActionIcon>
            <NumberInput
              size="xs"
              width={40}
              defaultValue={pageIndex + 1}
              style={{ width: 60 }}
              placeholder="Go to page"
              onChange={(val) => {
                gotoPage(val ? Number(val) - 1 : 0);
              }}
            />
          </Group>

          <Group spacing={2} position="center">
            <Text size="xs" color="dimmed">
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </Text>
          </Group>

          <Group spacing={2} position="right">
            <NativeSelect
              size="xs"
              data={['10', '20', '50', '100']}
              placeholder="Pick one"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            />

            <ActionIcon variant="light" color="indigo" onClick={() => nextPage()} disabled={!canNextPage}>
              <ChevronRight size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="indigo" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              <ChevronsRight size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}
