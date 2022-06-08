import { IApiResponse, IEntity } from '@dotars/di-core';
import { Button, Divider, Group, Modal, Stack } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { showNotification } from '@mantine/notifications';
import { createContext, PropsWithChildren, useContext, useRef, useState } from 'react';
import { Ban, ChevronsUpLeft, CircleCheck } from 'tabler-icons-react';

export type FormOpType = 'Create' | 'Update';

export type DialogOptions = {
  flag: boolean;
  title: string;
  type: FormOpType;
  entity?: IEntity;
};

const defOptions: DialogOptions = {
  flag: false,
  title: '',
  type: 'Create',
};

export interface IDialogFormContext {
  options: DialogOptions;
  openModel:(options:DialogOptions)=>void;
  close: () => void;
}
export const DialogFormContext = createContext<IDialogFormContext>({
  options: defOptions,
} as IDialogFormContext);

export const useDialogFormContext = () => useContext(DialogFormContext);

export const DialogFormProvider: React.FC = (rx) => {
  const [options, setOptions] = useState<DialogOptions>(defOptions);
  const close = () => {
    setOptions((p) => {
      return { ...p, flag: false };
    });
  };

  const openModel = (options:DialogOptions) => {
    setOptions(options);
  };
  return <DialogFormContext.Provider value={{ options, close,openModel }}>{rx.children}</DialogFormContext.Provider>;
};

export interface DialogFormProps<T> {
  okText?: string;
  form: UseFormReturnType<T>;
  processItem: (item: T, opType: FormOpType) => Promise<IApiResponse>;
}

export const DialogForm = <T extends object>(rx: PropsWithChildren<DialogFormProps<T>>) => {
  const refSub = useRef<HTMLButtonElement>(null);
  const { options,close } = useDialogFormContext();
  //const [{ flag, title, type }, setMdl] = useAtom(showMdlForm);

  const handleSubmit = async (values: typeof rx.form.values) => {
    const data = values as T;
    if (data) {
      const sx = await rx.processItem(data, options.type);
      if (!sx.failed) close();
      else showNotification({ title: 'Failed', message: `${sx?.messages}`, color: 'red', icon: <CircleCheck /> });
    }
  };
  const OnOkClick = () => {
    rx.form.clearErrors();
    rx.form.validate();
    if (Object.keys(rx.form.errors).length === 0) refSub?.current?.click();
  };
  const OnCancelClick = () => {
    close();
  };

  return (
    <Modal size="lg" title={options.title} centered withCloseButton={false} closeOnClickOutside={false} closeOnEscape={false} opened={options.flag} onClose={close}>
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
