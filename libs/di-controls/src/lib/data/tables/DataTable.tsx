import { IEntity, useEntityContext } from '@dotars/di-core';
import { Card, Center, Group, ScrollArea, Table } from '@mantine/core';
import { ReactElement, useMemo, useState } from 'react';
import { TableOptions, useAsyncDebounce, useGlobalFilter, useSortBy, useTable } from 'react-table';
import { ChevronDown, ChevronUp, Selector } from 'tabler-icons-react';
import { SearchCmdBar } from '../controls/CmdBar';
import { dataUiStyles } from '../Styles';

interface DataTableProps<T extends IEntity> extends TableOptions<T> {
  title: string;
  OnRefresh: () => void;
  OnCreate: () => void;
}

export function DataTable<T extends IEntity>({ columns, data, title, OnRefresh, OnCreate, ...rest }: DataTableProps<T>): ReactElement {
  const { classes, cx } = dataUiStyles();
  const [scrolled, setScrolled] = useState(false);
  const ectx = useEntityContext();

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable<T>({ columns: memoizedColumns, data: memoizedData, ...rest },  useGlobalFilter,useSortBy);
  const [search, setSearch] = useState(globalFilter);

  const OnSearch = (val:string) => {
    setSearch(val);
    setGlobalFilter(val || undefined);
  };
  // Render the UI for your table
  return (
    <Card withBorder p="lg" className={classes.card}>
      <Card.Section className={classes.header}>
        <SearchCmdBar title={title} searchStr={search} OnSearch={OnSearch} OnRefresh={OnRefresh} OnCreate={OnCreate} />
      </Card.Section>
      <Card.Section className={classes.content}>
        <ScrollArea sx={{ height: 450, paddingRight: 10 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
          <Table sx={{ minWidth: 10 }} {...getTableProps()}>
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
              {rows.map((row, i) => {
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
    </Card>
  );
}
