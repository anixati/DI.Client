import { Alert, Badge, Card, Center, Group, Loader, ScrollArea, Table, Text, UnstyledButton } from '@mantine/core';
import { ReactElement, useMemo, useState } from 'react';

import { ICodeRecord, IDataListResponse, useEntityContext } from '@dotars/di-core';
import axios from 'axios';
import { useAsync } from 'react-async-hook';
import useBus from 'use-bus';
import { SearchCmdBar } from '../controls';
import { dataUiStyles } from '../styles/Styles';

export interface RenderListProps {
  title: string;
  url: string;
  request?: any;
}
export function RenderList(rx: RenderListProps): ReactElement {
  const [search, setSearch] = useState('');
  const [selection, setSelection] = useState<number | undefined>(undefined);
  const { classes, cx } = dataUiStyles();
  const [, setScrolled] = useState(false);
  const entityCtx = useEntityContext();

  const selectRow = (row?: ICodeRecord) => {
    setSelection(row?.id);
    entityCtx?.select(row);
  };

  /* #region  get */
  const getData = async () => (await axios.post<IDataListResponse>(rx.url, { index: 0, size: 100 })).data;
  const asyncData = useAsync(getData, []);
  const memData = useMemo(() => asyncData.result?.result?.items, [asyncData.result]);

  /* #endregion */

  /* #region  BUS Events */
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
      const d = r['payload'] as ICodeRecord;
      if (d) {
        setSelection(d.id);
        asyncData.execute();
      }
    },
    [asyncData]
  );

  /* #endregion */

  /* #region  render list item */

  const rows = memData === undefined || memData.length <=0 ? <tr><td><Center>No data found!</Center></td></tr>: memData
    ?.filter((x) => x.name?.toLowerCase().includes(search) || x.description?.toLowerCase().includes(search) || search === '')
    //.sort((a,b) => { if(a) return a.id - b.id; return undefined;})
    .map((row) => {
      const selected = selection && selection === row.id;
      if (selected) entityCtx?.select(row);
      return (
        <tr key={row.id} className={cx({ [classes.rowSelected]: selected })} >
          <td>
            <UnstyledButton onClick={() => selectRow(row)} className={classes.linkbox}>
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
                    <Badge color="dotars" size="xs">
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

  /* #endregion */

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
          <Card.Section className={classes.cardHeader}>
            <SearchCmdBar title={rx.title} searchStr={search} OnSearch={(v) => setSearch(v)} OnRefresh={() => asyncData.execute()} OnCreate={() => selectRow(undefined)} />
          </Card.Section>
          <Card.Section className={classes.cardContent}>
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
}
