import { ActionIcon, Alert, Badge, Card, Group, Loader, ScrollArea, Table, Text, TextInput, UnstyledButton } from '@mantine/core';
import React, { ReactElement, useMemo, useState } from 'react';
import { Search } from 'tabler-icons-react';

import { ICodeRecord, IDataListResponse, useEntityContext } from '@dotars/di-core';
import axios from 'axios';
import { useAsync } from 'react-async-hook';
import { Refresh, SquarePlus } from 'tabler-icons-react';
import useBus from 'use-bus';
import { pnlBarStyles } from './Styles';

export interface RenderListProps {
  title: string;
  url: string;
  request?: any;
}
export function RenderList(rx: RenderListProps): ReactElement {
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<number | undefined>(undefined);
  const { classes, cx } = pnlBarStyles();
  const [scrolled, setScrolled] = useState(false);
  const entityCtx = useEntityContext();

  const getData = async () => (await axios.post<IDataListResponse>(rx.url, { index: 0, size: 100 })).data;
  const asyncData = useAsync(getData, []);
  const memData = useMemo(() => asyncData.result?.result?.items, [asyncData.result]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value.toLowerCase());
    //setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const selectRow = (row?: ICodeRecord) => {
    setSelection(row?.id);
    entityCtx?.select(row);
  };
  useBus('RELOAD', () => asyncData.execute(), [asyncData]);
  useBus(
    'ONDELETE',
    () => {
      selectRow(undefined);
      asyncData.execute();
    },
    [asyncData]
  );
  const rows = memData
    ?.filter((x) => x.name.toLowerCase().includes(search) || x.description.toLowerCase().includes(search) || search === '')
    .sort((a) => a.id)
    .map((row) => {
      const selected = selection && selection === row.id;
      if (selected) entityCtx?.select(row);
      return (
        <tr key={row.id} className={cx({ [classes.rowSelected]: selected })}>
          <td>
            <UnstyledButton onClick={() => selectRow(row)} className={classes.linkbox} >
              <div>
                <Group>
                  <Text size="sm" mb={3} sx={{ lineHeight: 1 }}>
                    {row.name}
                  </Text>
                  {row.isDisabled && (
                    <Badge color="red" size="xs">
                      Inactive
                    </Badge>
                  )}
                  {row.isLocked && (
                    <Badge color="indigo" size="xs">
                      Locked
                    </Badge>
                  )}
                </Group>
                <Text size="xs" color="dimmed">
                  {row.description}
                </Text>
              </div>
            </UnstyledButton>
          </td>
        </tr>
      );
    });

  return (
    <>
      {asyncData.loading && <Loader />}
      {asyncData.error && (
        <Alert title="Error!" color="red">
          {asyncData.error.message}
        </Alert>
      )}
      {asyncData.result && (
        <Card withBorder p="lg" className={classes.card}>
          <Card.Section className={classes.header}>
            <Group spacing="sm" position="apart">
              <Group spacing="sm" position="left">
                <Text weight={500}>{rx.title}</Text>
              </Group>
              <Group position="right" spacing={3}>
                <TextInput size="xs" placeholder="Search" icon={<Search size={14} />} value={search} onChange={handleSearchChange} />
                <ActionIcon variant="light" onClick={() => asyncData.execute()}>
                  <Refresh size={16} />
                </ActionIcon>
                <ActionIcon variant="filled" onClick={() => selectRow(undefined)}>
                  <SquarePlus size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Card.Section>
          <Card.Section className={classes.content}>
            <ScrollArea sx={{ height: '89vh' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
              <Table sx={{}} verticalSpacing="xs">
                <tbody>{rows}</tbody>
              </Table>
            </ScrollArea>
          </Card.Section>
        </Card>
      )}
    </>
  );
}
