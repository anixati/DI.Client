import { IApiResponse, IEntity } from '@dotars/di-core';
import { Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { showNotification } from '@mantine/notifications';
import { atom, useAtom } from 'jotai';
import { PropsWithChildren, useRef } from 'react';
import { Ban, ChevronsUpLeft, CircleCheck } from 'tabler-icons-react';

export interface MdlFormProps<T> {
  okText?: string;
  form: UseFormReturnType<T>;
  processItem: (item: T, opType: FormOpType) => Promise<IApiResponse>;
}

export type FormOpType = 'Create' | 'Update';
export type ShowMdlProps = {
  flag: boolean;
  title: string;
  type: FormOpType;
  entity?: IEntity;
};

export const showMdlForm = atom<ShowMdlProps>({ flag: false, title: 'Create New', type: 'Create' });
export const MdlForm = <T extends IEntity>(rx: PropsWithChildren<MdlFormProps<T>>) => {
  const refSub = useRef<HTMLButtonElement>(null);
  const [{ flag, title, type }, setMdl] = useAtom(showMdlForm);

  const handleSubmit = async (values: typeof rx.form.values) => {
    const data = values as T;
    if (data) {
      const sx = await rx.processItem(data, type);
      if (!sx.failed) closeModel();
      else showNotification({ title: 'Failed', message: `${sx?.messages}`, color: 'red', icon: <CircleCheck /> });
    }
  };
  const OnOkClick = () => {
    rx.form.clearErrors();
    rx.form.validate();
    if (Object.keys(rx.form.errors).length === 0) refSub?.current?.click();
  };
  const OnCancelClick = () => {
    closeModel();
  };

  const closeModel = () => {
    setMdl((p) => {
      return { ...p, flag: false };
    });
  };
  return (
    <Modal size="lg" title={title} centered withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false} opened={flag} onClose={closeModel}>
      <Stack>
        <form onSubmit={rx.form.onSubmit(handleSubmit)}>
          <button hidden={true} ref={refSub} type={'submit'} />
          {rx.children}
        </form>
        <Divider />
        <Group position="right">
          <Button leftIcon={<Ban />} size="xs" variant="light" color="red" onClick={OnCancelClick}>
            Cancel
          </Button>
          <Button leftIcon={<ChevronsUpLeft />} size="xs" onClick={OnOkClick}>
            {rx.okText ? rx.okText : 'Save'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
