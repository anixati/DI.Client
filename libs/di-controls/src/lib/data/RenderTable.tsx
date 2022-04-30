import React, { ReactElement, useMemo, useState } from 'react';
import { Row, TableOptions, useTable } from 'react-table';
import { createStyles, Table, ScrollArea } from '@mantine/core';

const useStyles = createStyles((theme) => ({
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',

    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

interface TableProps<T extends Record<string, unknown>> extends TableOptions<T> {
  onClick?: (row: Row<T>) => void;
}

export function RenderTable<T extends Record<string, unknown>>({ columns, data, onClick, ...rest }: TableProps<T>): ReactElement {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<T>({ columns: memoizedColumns, data: memoizedData, ...rest });

  // Render the UI for your table
  return (
    <ScrollArea sx={{ height: 300 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
      <Table sx={{ minWidth: 10 }} {...getTableProps()}>
        <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
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
