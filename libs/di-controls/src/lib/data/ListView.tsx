import { Card, createStyles, Group } from '@mantine/core';
import React, { useMemo } from 'react';
import { usePagination, TableOptions, Column } from 'react-table';
import { RenderTable } from './RenderTable';

const useStyles = createStyles((theme) => ({
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
  },
  header: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  content: {
    minHeight: 380,
  },
}));

export interface ListViewProps {
  title: string;
  desc?: string;
}

export const ListView: React.FC<ListViewProps> = (rx) => {
  const { classes } = useStyles();


  type col = { col1: string; col2: string }

  const data: col[] = [
    {
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },{
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },{
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },{
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },{
      col1: 'Hello',
      col2: 'World',
    },
    {
      col1: 'react-table',
      col2: 'rocks',
    },
    {
      col1: 'whatever',
      col2: 'you want',
    },
  ]

  const columns:Array<Column<col>> = [
    {
      Header: 'Column 1',
      accessor: 'col1',
    },
    {
      Header: 'Column 2',
      accessor: 'col2',
    },
  ]


  

  return (
    <Card withBorder p="xs">
      <Card.Section className={classes.header}>
        <Group spacing="sm"></Group>
      </Card.Section>
      <Card.Section>


      <RenderTable<col> data={data} columns={columns}  onClick={(r)=>{
        console.log(r);
      }}/>


      </Card.Section>
      <Card.Section className={classes.footer}>{rx.children}</Card.Section>
    </Card>
  );
};
