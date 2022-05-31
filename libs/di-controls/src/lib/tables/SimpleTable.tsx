import { IEntity } from '@dotars/di-core';
import { Center, Group, ScrollArea, Table } from '@mantine/core';
import { ReactElement, useMemo, useState } from 'react';
import { Row, TableOptions, useSortBy, useTable } from 'react-table';
import { ChevronDown, ChevronUp, Selector } from 'tabler-icons-react';
import { dataUiStyles } from '../styles/Styles';

interface SimpleTableProps<T extends IEntity> extends TableOptions<T> {
  onClick?: (row: Row<T>) => void;
}

export function SimpleTable<T extends IEntity>({ columns, data, onClick, ...rest }: SimpleTableProps<T>): ReactElement {
  const { classes, cx } = dataUiStyles();
  const [scrolled, setScrolled] = useState(false);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<T>({ columns: memoizedColumns, data: memoizedData, ...rest }, useSortBy);

  // Render the UI for your table
  return (
    <ScrollArea sx={{ height: 450,paddingRight:10 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
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
  );
}
