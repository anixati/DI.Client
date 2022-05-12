import { Alert, Card, Center, Loader, ScrollArea, Table, UnstyledButton } from '@mantine/core';
import { PropsWithChildren, useMemo, useState } from 'react';

import { IEntity, IGenericListResponse, useEntityContext } from '@dotars/di-core';
import axios from 'axios';
import { useAsync } from 'react-async-hook';
import useBus from 'use-bus';
import { SearchCmdBar } from '../controls/CmdBar';
import { dataUiStyles } from '../Styles';
import { ListItem } from './ListItem';

export interface GenericListProps<T extends IEntity> {
  title: string;
  url: string;
  request?: any;
  predicate: (instr: string) => (v: T, i: number, a: T[]) => unknown;
  rndrTitle: (item: T) => React.ReactNode;
  rndrDesc: (item: T) => React.ReactNode;
}

export const GenericList = <T extends IEntity>(rx: PropsWithChildren<GenericListProps<T>>) => {
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<number | undefined>(undefined);
  const { classes, cx } = dataUiStyles();
  const [scrolled, setScrolled] = useState(false);
  const entityCtx = useEntityContext();
  const selectRow = (row?: T) => {
    setSelection(row?.id);
    entityCtx?.select(row);
  };
  const getData = async () => (await axios.post<IGenericListResponse<T>>(rx.url, { index: 0, size: 100 })).data;
  const asyncData = useAsync(getData, []);
  const memData = useMemo(() => asyncData.result?.result?.items, [asyncData.result]);
  useBus('RELOAD', () => asyncData.execute(), [asyncData]);
  useBus(
    'ONDELETE',
    () => {
      selectRow(undefined);
      asyncData.execute();
    },
    [asyncData]
  );
  useBus(
    'RELOADSELECTED',
    (r) => {
      const d = r['payload'] as T;
      if (d) {
        setSelection(d.id);
        asyncData.execute();
      }
    },
    [asyncData]
  );

  const rows =
    memData === undefined || memData.length <= 0 ? (
      <tr>
        <td>
          <Center>No data found!</Center>
        </td>
      </tr>
    ) : (
      memData
        ?.filter(rx.predicate(search))
        //.sort((a,b) => { if(a) return a.id - b.id; return undefined;})
        .map((row) => {
          const selected = selection && selection === row.id;
          if (selected) entityCtx?.select(row);
          return (
            <tr key={row.id} className={cx({ [classes.rowSelected]: selected })}>
              <td>
                <UnstyledButton onClick={() => selectRow(row)} className={classes.linkbox}>
                  <div>
                    <ListItem key={row.id} item={row} title={rx.rndrTitle} desc={rx.rndrDesc} />
                  </div>
                </UnstyledButton>
              </td>
            </tr>
          );
        })
    );

  return (
    <>
      {asyncData.loading && <Loader />}
      {asyncData.error && (
        <Alert title="Error!" color="red">
          {asyncData.error.message}
        </Alert>
      )}
      {asyncData.result && (
        <Card withBorder p="lg" className={classes.listView}>
          <Card.Section className={classes.header}>
            <SearchCmdBar title={rx.title} searchStr={search} OnSearch={(v) => setSearch(v)} OnRefresh={() => asyncData.execute()} OnCreate={() => selectRow(undefined)} />
          </Card.Section>
          <Card.Section className={classes.content}>
            <ScrollArea sx={{ height: '76vh' }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
              <Table sx={{}} verticalSpacing="xs" width={250}>
                <tbody>{rows}</tbody>
              </Table>
            </ScrollArea>
          </Card.Section>
        </Card>
      )}
    </>
  );
};
