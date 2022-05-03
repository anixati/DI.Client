import { IApiResponse, IChangeRequest, IEntity, IGenericListResponse, NoOpResponse, useEntityContext } from '@dotars/di-core';
import { ActionIcon, Alert, Card, Group, Loader, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { UseFormInput, UseFormReturnType } from '@mantine/form/lib/use-form';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useAtom } from 'jotai';
import { ReactElement, useEffect, useState } from 'react';
import { useAsync } from 'react-async-hook';
import { CellProps, Column } from 'react-table';
import { AlertOctagon, CircleCheck, Edit, Eraser } from 'tabler-icons-react';
import { SearchCmdBar } from '../controls/CmdBar';
import { FormOpType, MdlForm, showMdlForm } from '../controls/MdlForm';
import { dataUiStyles } from '../Styles';
import { SimpleTable } from '../tables/SimpleTable';
import * as jpatch from 'fast-json-patch';
import { DataTable } from '../tables/DataTable';

export interface CodeTableProps<T extends IEntity> {
  title: string;
  baseUrl: string;
  columns: ReadonlyArray<Column<T>>;
  config: UseFormInput<T>;
  renderForm: (form: UseFormReturnType<T>) => React.ReactNode;
}

export function SubCodeTable<T extends IEntity>(rx: CodeTableProps<T>): ReactElement {
  const { classes } = dataUiStyles();
  const modals = useModals();
  const [search, setSearch] = useState('');
  const form = useForm<T>(rx.config);
  const ectx = useEntityContext();

  const [{ entity }, setMdl] = useAtom(showMdlForm);

  /* #region  get Table data */
  const getCodes = async () => {
    const request = { keyId: ectx?.entity?.id, index: 0, size: 100 };
    console.log(request);
    const resp = await axios.post<IGenericListResponse<T>>(rx.baseUrl, request);
    const data = resp.data;
    if (data.failed) {
      console.log(data);
      showNotification({ message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
    }
    return data;
  };
  const asyncApi = useAsync(getCodes, []);
  useEffect(() => {
    asyncApi.execute();
  }, [ectx?.entity]);
  /* #endregion */

  /* #region  Delete */
  const deleteEntity = async (request: IChangeRequest) => {
    const resp = await axios.post<IApiResponse>(`${rx.baseUrl}/change`, request);
    const message = resp.data.failed ? `${resp.data.messages}` : 'Deleted Succesfully';
    showNotification({ message, color: resp.data.failed ? 'red' : 'green', icon: <AlertOctagon /> });
    return resp.data;
  };
  const deleteItem = (row: T) =>
    modals.openConfirmModal({
      title: 'Please confirm',
      centered: true,
      children: <Text size="sm">Are you sure you want to delete this </Text>,
      labels: { confirm: 'Yes', cancel: 'No' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (row.id) await deleteEntity({ name: `Delete`, id: row.id, action: 6, reason: '' }).then(() => asyncApi.execute());
      },
    });

  /* #endregion */

  const actionCol: Array<Column<T>> = [
    {
      Header: '', // No header
      id: 'edit_action', // It needs an ID
      Cell: ({ row }: CellProps<T>) => (
        <Group spacing={1} position="right">
          <ActionIcon variant="light" color="blue" onClick={() => editItem(row.original)}>
            <Edit size={16} />
          </ActionIcon>
          <ActionIcon variant="light" color="red" onClick={() => deleteItem(row.original)}>
            <Eraser size={16} />
          </ActionIcon>
        </Group>
      ),
    },
  ];

  const processItem = (item: T, type: FormOpType): Promise<IApiResponse> => {
    return type === 'Update' ? UpdateItem(item) : CreateItem(item);
  };
  const editItem = (row: T) => {
    form.clearErrors();
    form.setValues(row);
    setMdl({ flag: true, title: 'Update item', type: 'Update', entity: row });
  };
  const UpdateItem = async (item: T): Promise<IApiResponse> => {
    if (entity) {
      const changeSet = jpatch.compare(entity, item);
      if (Array.isArray(changeSet)) {
        const patchResp = await axios.patch<IApiResponse>(`${rx.baseUrl}/${entity.id}`, changeSet);
        if (!patchResp.data.failed) {
          showNotification({ message: `Updated Sucessfully`, color: 'green', icon: <CircleCheck /> });
          asyncApi.execute();
        }
        return patchResp.data;
      }
    }
    return NoOpResponse;
  };

  const createItem = () => {
    form.clearErrors();
    form.reset();
    setMdl({ flag: true, title: 'Create a new item', type: 'Create', entity: undefined });
  };

  const CreateItem = async (item: T): Promise<IApiResponse> => {
    const response = await axios.post<IApiResponse>(`${rx.baseUrl}/create`, item);
    if (!response.data.failed) {
      showNotification({ message: `Created Sucessfully`, color: 'green', icon: <CircleCheck /> });
      asyncApi.execute();
    }
    return response.data;
  };

  return (
    <div>
      <MdlForm form={form} processItem={processItem}>
        {rx.renderForm(form)}
      </MdlForm>
      {ectx && ectx.entity && (
        <>
          {asyncApi.loading && <Loader />}
          {asyncApi.error && (
            <Alert title="Error!" color="red">
              {asyncApi.error.message}
            </Alert>
          )}
          {asyncApi.result && asyncApi.result?.result && (
            // <Card withBorder p="lg" className={classes.card}>
            //   <Card.Section className={classes.header}>
            //     <SearchCmdBar title={rx.title} searchStr={search} OnSearch={(v) => setSearch(v)} OnRefresh={() => asyncApi.execute()} OnCreate={createItem} />
            //   </Card.Section>
            //   <Card.Section className={classes.content}>{asyncApi.result?.result && <SimpleTable<T> data={asyncApi.result?.result?.items} columns={[...rx.columns, ...actionCol]} />}</Card.Section>
            // </Card>
            <DataTable<T> title={rx.title}  OnRefresh={() => asyncApi.execute()} OnCreate={createItem} data={asyncApi.result?.result?.items} columns={[...rx.columns, ...actionCol]} />
          )}
        </>
      )}
    </div>
  );
}
