import { getErrorMsg, IApiResponse, IChangeRequest, IEntity, NoOpResponse, useEntityContext } from '@dotars/di-core';
import { ActionIcon, Alert, Button, Group, LoadingOverlay, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { UseFormInput, UseFormReturnType } from '@mantine/form/lib/use-form';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import * as jpatch from 'fast-json-patch';
import { ReactElement } from 'react';
import { useQuery } from 'react-query';
import { CellProps, Column } from 'react-table';
import { AlertOctagon, CircleCheck, Edit, Eraser } from 'tabler-icons-react';
import { DialogForm, DialogFormProvider, FormOpType, useDialogFormContext } from '../forms/DialogForm';
import { getCodes } from './api';
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
  //if(entity === undefined) return <>.</>
  //const [{ entity }, setMdl] = useAtom(showMdlForm);

  /* #region  get Table data */

  // const asyncApi = useAsync(getCodes, []);
  // useEffect(() => {
  //   asyncApi.execute();
  // }, [entity, asyncApi]);

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
          {/* <ActionIcon variant="transparent" color="dotars" onClick={() => editItem(row.original)}>
            <Edit size={16} />
          </ActionIcon>
          <ActionIcon variant="transparent" color="red" onClick={() => deleteItem(row.original)}>
            <Eraser size={16} />
          </ActionIcon> */}
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
    openModel({ flag: true, title: 'Update item', type: 'Update', entity: row });
  };
  const UpdateItem = async (item: T): Promise<IApiResponse> => {
    if (rx.entity) {
      const changeSet = jpatch.compare(rx.entity, item);
      if (Array.isArray(changeSet)) {
        const patchResp = await axios.patch<IApiResponse>(`${rx.baseUrl}/${rx.entity.id}`, changeSet);
        if (!patchResp.data.failed) {
          showNotification({ message: `Updated Sucessfully`, color: 'green', icon: <CircleCheck /> });
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
    if (!response.data.failed) {
      showNotification({ message: `Created Sucessfully`, color: 'green', icon: <CircleCheck /> });
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

      <DataTable<T> title={rx.title} OnRefresh={OnRefresh} OnCreate={createItem} data={rx.data} columns={[...rx.columns, ...actionCol]} />
    </>
  );
}
