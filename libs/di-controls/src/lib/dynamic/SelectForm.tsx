import { getErrorMsg, IApiResponse, ISelectedItem } from '@dotars/di-core';
import { Button, Group, LoadingOverlay, SelectItem } from '@mantine/core';
import { useModals } from '@mantine/modals';
import axios from 'axios';
import { createRef, useCallback, useContext, useState } from 'react';
import { ShowError, ShowInfo } from '../controls';
import { SchemaListRef, SchemaListTable } from '../datagrid';
import { MdlContext } from './Context';

export interface MultiSelectFormProps {
  title?: string;
  schemaKey: string;
  options?: Array<SelectItem>;
  entityId?: string;
  initialValues?: Record<string, string>;
}

export const MultiSelectForm: React.FC<MultiSelectFormProps> = (rx) => {
  // const { classes } = formStyles();
  const modals = useModals();
  const listRef = createRef<SchemaListRef>();
  const { modalId } = useContext(MdlContext);
  const [loading, setLoading] = useState(false);
  const closeModal = () => {
    modals.closeModal(modalId);
  };

  const submitData = useCallback(async (values: ISelectedItem[]) => {
    try {
      setLoading(true);
      if (values.length > 0) {
        const data = Object.assign({}, ...values.map((x) => ({ [x.value]: x.label })));
        const payLoad = { schema: rx.schemaKey, data: data, entityId: rx.entityId };
        const resp = await axios.post<IApiResponse>(`/forms/manage`, payLoad);
        if (resp.data.failed || resp.data.result === null) {
          if (resp.data.result == null) ShowError('Failed', `No response receieved`);
          else ShowError('Failed', `${resp.data.messages}`);
        } else {
          ShowInfo('Success!', 'Updated sucessfully!');
          closeModal();
        }
      }
    } catch (err) {
      ShowError('Failed', `API error:${getErrorMsg(err)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const onSelect = () => {
    if (listRef.current) {
      const rv = listRef.current.getSelectedRows();
      if (rv !== null) {
        submitData(rv);
      }
    }
  };
  return (
    <>
      <LoadingOverlay visible={loading} />
      {rx.options && (
        <SchemaListTable
          mode="MULTISELECT"
          ref={listRef}
          schemas={rx.options}
          renderCmds={() => {
            return (
              <Group spacing={2}>
                <Button compact color="dotars" onClick={onSelect}>
                  Select
                </Button>
                <Button compact color="red" onClick={() => closeModal()}>
                  Close
                </Button>
              </Group>
            );
          }}
        />
      )}
    </>
  );
};
