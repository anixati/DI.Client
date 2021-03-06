import { IEntity } from '@dotars/di-core';
import { Card, Center, Group, ScrollArea, Table } from '@mantine/core';
import { ReactElement, useMemo, useState } from 'react';
import { TableOptions, useGlobalFilter, useSortBy, useTable } from 'react-table';
import { ChevronDown, ChevronUp, Selector } from 'tabler-icons-react';
import { SearchCmdBar } from '../controls';
import { dataUiStyles } from '../styles/Styles';

interface DataTableProps<T extends IEntity> extends TableOptions<T> {
  title: string;
  canCreate?:boolean;
  OnRefresh: () => void;
  OnCreate: () => void;
}

export function DataTable<T extends IEntity>({ columns, data, title, OnRefresh, OnCreate,canCreate, ...rest }: DataTableProps<T>): ReactElement {
  const { classes, cx } = dataUiStyles();
  const [scrolled, setScrolled] = useState(false);
  //const ectx = useEntityContext();
  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => data, [data]);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter },
    setGlobalFilter,
  } = useTable<T>({ columns: memoizedColumns, data: memoizedData, ...rest },  useGlobalFilter,useSortBy);
  const [search, setSearch] = useState(globalFilter);

  const OnSearch = (val:string) => {
    setSearch(val);
    setGlobalFilter(val || undefined);
  };
  // Render the UI for your table
  return (
    <Card withBorder p="lg" >
      <Card.Section className={classes.cardHeader}>
        <SearchCmdBar title={title} searchStr={search} OnSearch={OnSearch} OnRefresh={OnRefresh} OnCreate={OnCreate} canCreate={canCreate}/>
      </Card.Section>
      <Card.Section className={classes.cardContent}>
        <ScrollArea sx={{ minHeight: 350, paddingRight: 20,paddingLeft:10 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
          <Table sx={{ }} {...getTableProps()} verticalSpacing={2} fontSize="xs" horizontalSpacing={2} striped highlightOnHover>
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
