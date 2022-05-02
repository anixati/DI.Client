import { IEntity, IGenericListResponse, useEntityContext } from '@dotars/di-core';
import { ActionIcon, Alert, Card, Group, Loader } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { ReactElement, useEffect, useState } from 'react';
import { useAsync } from 'react-async-hook';
import { CellProps, Column } from 'react-table';
import { AlertOctagon, Edit, Eraser } from 'tabler-icons-react';
import { SearchCmdBar } from '../controls/CmdBar';
import { dataUiStyles } from '../Styles';
import { SimpleTable } from '../tables/RenderTable';

export interface CodeTableProps<D extends object> {
  title: string;
  baseUrl: string;
  columns: ReadonlyArray<Column<D>>;
}

export function SubCodeTable<T extends IEntity>(rx: CodeTableProps<T>): ReactElement {
  const { classes } = dataUiStyles();
  const [search, setSearch] = useState('');

  const ectx = useEntityContext();
  const getCodes = async () => {
    const request = { keyId: ectx?.entity?.id, index: 0, size: 100 };
    console.log(request);
    const resp = await axios.post<IGenericListResponse<T>>(rx.baseUrl, request);
    const data = resp.data;
    if (data.failed) {
      console.log(data);
      showNotification({ autoClose: 5000, title: 'Failed to change state', message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
    }
    return data;
  };
  const asyncApi = useAsync(getCodes, []);
  useEffect(() => {
    asyncApi.execute();
  }, [ectx?.entity]);

  //const memData = useMemo<T[] | undefined>(() => asyncApi.result?.result, [asyncApi.result]);
  const createItem = () => {
    // console.log(memData, '');
  };
  const editItem = (row:T) => {
     console.log(row, '^^^^^^^');
  };
  const deleteItem = (row:T) => {
    console.log(row, '^^^^^^^');
  };

  const actionCol: Array<Column<T>> = [
    {
      Header: '', // No header
      id: 'edit_action', // It needs an ID
      Cell: ({row}:CellProps<T>) => (
        <Group position="left">
          <ActionIcon variant="light" color="blue" onClick={() => editItem(row.original)}>
            <Edit size={16} />
          </ActionIcon>{' '}
          <ActionIcon variant="light" color="red" onClick={() => deleteItem(row.original)}>
            <Eraser size={16} />
          </ActionIcon>
        </Group>
      ),
    }
  ];

  return (
    <div>
      {ectx && ectx.entity && (
        <>
          {asyncApi.loading && <Loader />}
          {asyncApi.error && (
            <Alert title="Error!" color="red">
              {asyncApi.error.message}
            </Alert>
          )}
          {asyncApi.result && (
            <Card withBorder p="lg" className={classes.card}>
              <Card.Section className={classes.header}>
                <SearchCmdBar title={rx.title} searchStr={search} OnSearch={(v) => setSearch(v)} OnRefresh={() => asyncApi.execute()} OnCreate={createItem} />
              </Card.Section>
              <Card.Section className={classes.content}>{asyncApi.result?.result && <SimpleTable<T> data={asyncApi.result?.result?.items} columns={[...rx.columns,...actionCol]} />}</Card.Section>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
