import { ActionIcon, Center, createStyles, Group, NativeSelect, NumberInput, Text } from '@mantine/core';
import { ReactElement } from 'react';
import { HeaderGroup } from 'react-table';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Selector } from 'tabler-icons-react';

export interface pagingProps {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  pageLength: number;
  setPageSize: (inp: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  gotoPage: (inp: number) => void;
}

export function RenderPagingBar(rx: pagingProps) {
  return (
    <Group spacing="sm" position="apart">
      <Group spacing={2} position="left">
        <ActionIcon variant="filled" color="dotars" onClick={() => rx.gotoPage(0)} disabled={!rx.canPreviousPage}>
          <ChevronsLeft size={16} />
        </ActionIcon>
        <ActionIcon variant="filled" color="dotars" onClick={() => rx.previousPage()} disabled={!rx.canPreviousPage}>
          <ChevronLeft size={16} />
        </ActionIcon>
        <NumberInput
          color="dotars"
          size="xs"
          width={40}
          defaultValue={rx.pageIndex + 1}
          style={{ width: 60 }}
          placeholder="Go to page"
          onChange={(val) => {
            rx.gotoPage(val ? Number(val) - 1 : 0);
          }}
        />
      </Group>
      <Group spacing={2} position="center">
        <Text size="xs" color="dimmed">
          Page{' '}
          <strong>
            {rx.pageIndex + 1} of {rx.pageLength}
          </strong>{' '}
        </Text>
      </Group>
      <Group spacing={2} position="right">
        <NativeSelect
          color="dotars"
          size="xs"
          data={['10', '20', '50', '100']}
          placeholder="Pick one"
          value={rx.pageSize}
          onChange={(e) => {
            rx.setPageSize(Number(e.target.value));
          }}
        />
        <ActionIcon variant="filled" color="dotars" onClick={() => rx.nextPage()} disabled={!rx.canNextPage}>
          <ChevronRight size={16} />
        </ActionIcon>
        <ActionIcon variant="filled" color="dotars" onClick={() => rx.gotoPage(rx.pageCount - 1)} disabled={!rx.canNextPage}>
          <ChevronsRight size={16} />
        </ActionIcon>
      </Group>
    </Group>
  );
}

// const useStyles = createStyles((theme) => ({
  
// }));

// export function RenderTableHeader<T extends object>(groups: Array<HeaderGroup<T>>): ReactElement {
//   const { classes } = useStyles();
//   console.log(groups);
//   return (
//     <>
//       {groups.map((headerGroup) => {
//         return <tr {...headerGroup.getHeaderGroupProps()}>
//           {headerGroup.headers.map((column) => {
//             return <th {...column.getHeaderProps(column.getSortByToggleProps())} className={classes.tableTh}>
//               <Group position="left" spacing={4}>
//                 {column.render('Header')}
//                 {column.Header !== '' && <Center className={classes.tableicon}>{column.isSorted ? column.isSortedDesc ? <ChevronUp size={14} /> : <ChevronDown size={14} /> : <Selector size={14} />}</Center>}
//               </Group>
//             </th>;
//           })}
//         </tr>;
//       })}
//     </>
//   );
// }
