import { getErrorMsg, IApiResponse, IChangeRequest, IEntity, NoOpResponse, useEntityContext } from '@dotars/di-core';
import { Alert, Button, Group, LoadingOverlay, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { UseFormInput, UseFormReturnType } from '@mantine/form/lib/use-form';
import { useModals } from '@mantine/modals';
import axios from 'axios';
import * as jpatch from 'fast-json-patch';
import { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';
import { CellProps, Column } from 'react-table';
import { ShowError, ShowInfo } from '../controls';
import { DialogForm, DialogFormProvider, FormOpType, useDialogFormContext } from '../forms/DialogForm';
import { getCodes } from '../datagrid/api';
import { DataTable } from './DataTable';

export interface SubCodeTableProps<T extends IEntity> {
  title: string;
  baseUrl: string;
  columns: ReadonlyArray<Column<T>>;
  config: UseFormInput<T>;
  renderForm: (form: UseFormReturnType<T>) => React.ReactNode;
}

export function SubCodeTable<T extends IEntity>(rx: SubCodeTableProps<T>): ReactElement {
  const { entity } = useEntityContext();
  const { isLoading, error, data, isSuccess, refetch } = useQuery([rx.baseUrl, entity], async () => await getCodes(rx.baseUrl, entity?.id), { keepPreviousData: false, staleTime: Infinity });

  if (isLoading) return <LoadingOverlay visible={true} />;
  if (error)
    return (
      <Alert title="Error!" color="red">
        {getErrorMsg(error)}{' '}
      </Alert>
    );
  const OnRefresh = () => {
    refetch();
  };

  return (
    <div>
      {isSuccess && data && (
        <DialogFormProvider>
          <RenderTableView<T> {...rx} data={data.items as T[]} OnRefresh={OnRefresh} entity={entity} />
        </DialogFormProvider>
      )}
    </div>
  );
}

interface RenderTableProps<T extends IEntity> extends SubCodeTableProps<T> {
  data: T[];
  OnRefresh: () => void;
  entity?: IEntity;
}

function RenderTableView<T extends IEntity>(rx: RenderTableProps<T>): ReactElement {
  const modals = useModals();
  const form = useForm<T>(rx.config);
  const { openModel } = useDialogFormContext();

  /* #region  Delete */
  const deleteEntity = async (request: IChangeRequest) => {
    const resp = await axios.post<IApiResponse>(`${rx.baseUrl}/change`, request);
    if (resp.data.failed) ShowError('Failed', `${resp.data.messages}`);
    else ShowInfo('Success', `Deleted Succesfully`);
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
        if (row.id) await deleteEntity({ name: `Delete`, id: row.id, action: 6, reason: '' }).then(() => OnRefresh());
      },
    });

  /* #endregion */
  const actionCol: Array<Column<T>> = [
    {
      Header: '',
      id: 'edit_action',
      Cell: ({ row }: CellProps<T>) => (
        <Group spacing={1} position="right">
          <Button size="xs" variant="subtle" color="cyan" compact onClick={() => editItem(row.original)}>
            Edit
          </Button>
          <Button size="xs" variant="subtle" color="red" compact onClick={() => deleteItem(row.original)}>
            Delete
          </Button>
        </Group>
      ),
    },
  ];

  const processItem = (item: T, type: FormOpType): Promise<IApiResponse> => {
    return type === 'Update' ? UpdateItem(item) : CreateItem(item);
  };

  const [original, setOriginal] = useState<T|undefined>(undefined);
  const editItem = (row: T) => {
    form.clearErrors();
    form.setValues(row);
    setOriginal(row);
    openModel({ flag: true, title: 'Update item', type: 'Update', entity: row });
  };
  const UpdateItem = async (item: T): Promise<IApiResponse> => {
    if (original) {
      const changeSet = jpatch.compare(original, item);
      if (Array.isArray(changeSet)) {
        const patchResp = await axios.patch<IApiResponse>(`${rx.baseUrl}/${original.id}`, changeSet);
        if (patchResp.data.failed) ShowError('Failed', `${patchResp.data.messages}`);
        else {
          ShowInfo('Success', `Updated Succesfully`);
          rx.OnRefresh();
        }
        return patchResp.data;
      }
    }
    return NoOpResponse;
  };

  const createItem = () => {
    form.clearErrors();
    form.reset();
    openModel({ flag: true, title: 'Create a new item', type: 'Create', entity: undefined });
  };

  const CreateItem = async (item: T): Promise<IApiResponse> => {
    const response = await axios.post<IApiResponse>(`${rx.baseUrl}/create`, item);
    if (response.data.failed) ShowError('Failed', `${response.data.messages}`);
    else {
      ShowInfo('Success', `Created Succesfully`);
      rx.OnRefresh();
    }
    return response.data;
  };
  const OnRefresh = () => {
    rx.OnRefresh();
  };
  return (
    <>
      <DialogForm form={form} processItem={processItem}>
        {rx.renderForm(form)}
      </DialogForm>

      <DataTable<T> title={rx.title} OnRefresh={OnRefresh} OnCreate={createItem} canCreate={true} data={rx.data} columns={[...rx.columns, ...actionCol]} />
    </>
  );
}
