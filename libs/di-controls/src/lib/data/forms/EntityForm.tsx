import { IApiResponse, IEntity, useEntityContext } from '@dotars/di-core';
import { Container } from '@mantine/core';
import { useForm } from '@mantine/form';
import { UseFormInput, UseFormReturnType } from '@mantine/form/lib/use-form';
import { PropsWithChildren, useEffect, useRef } from 'react';
import { EntityBar } from './EntityBar';
import { EntityView } from './EntityView';
import { dataUiStyles } from '../Styles';
import * as jpatch from 'fast-json-patch';
import axios from 'axios';
import { dispatch } from 'use-bus';
import { showNotification } from '@mantine/notifications';
import { AlertOctagon, CircleCheck } from 'tabler-icons-react';

export interface EntityFormProps<T extends IEntity> {
  baseUrl: string;
  canLock:boolean;
  config: UseFormInput<T>;
  submitData?: (values: T) => void;
  renderForm: (form: UseFormReturnType<T>) => React.ReactNode;
}

export const EntityForm = <T extends IEntity>(rx: PropsWithChildren<EntityFormProps<T>>) => {
  const { classes } = dataUiStyles();
  const form = useForm<T>(rx.config);
  const ectx = useEntityContext();
  const isNew = ectx?.entity === undefined;
  useEffect(() => {
    form.clearErrors();
    if (ectx?.entity) {
      form.setValues(ectx.entity as T);
    } else {
      form.reset();
    }
  }, [ectx]);
  const refSub = useRef<HTMLButtonElement>(null);

  const handleSubmit = (values: typeof form.values) => {
    const data = values as T;
    if (data) {
      try {
        ectx?.showLoading(true);
        if (data.id === 0) createItem(data);
        else UpdateItem(data);
      } finally {
        ectx?.showLoading(false);
      }
    }
  };

  /* #region  Create */
  const onCreate = () => {
    form.clearErrors();
    form.validate();
    if (Object.keys(form.errors).length === 0) refSub?.current?.click();
  };
  const createItem = async (item: T) => {
    await createEntityApi(item);
  };
  const createEntityApi = async (item: T) => {
    const resp = await axios.post<IApiResponse>(`${rx.baseUrl}/create`, item);
    const data = resp.data;
    if (data.failed) {
      showNotification({  message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
    } else {
      form.reset();
      showNotification({ message: 'Created Sucessfully!', color: 'green', icon: <CircleCheck /> });
      dispatch({ type: 'RELOADSELECTED', payload: item });
    }
    return data;
  };
  /* #endregion */

  /* #region  Upadates */
  const onUpdate = () => {
    form.clearErrors();
    form.validate();
    if (Object.keys(form.errors).length === 0) refSub?.current?.click();
  };
  const UpdateItem = async (item: T) => {
    const original = ectx?.entity as T;
    if (original) {
      const changeSet = jpatch.compare(original, item);
      if (Array.isArray(changeSet)) {
        const patchResp = await axios.patch<IApiResponse>(`${rx.baseUrl}/${original.id}`, changeSet);
        const data = patchResp.data;
        if (data.failed) {
          console.log(data);
          showNotification({ autoClose: 5000, title: 'Failed to update', message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
        } else {
          showNotification({ autoClose: 5000, title: 'Updated Sucessfully!', message: `${data?.result?.message}`, color: 'green', icon: <CircleCheck /> });
          dispatch({ type: 'RELOADSELECTED', payload: item });
        }
      }
    }
  };

  /* #endregion */
  return (
    <EntityView name="Item" toolBar={<EntityBar disabled={false} url={`${rx.baseUrl}/change`} OnCreate={onCreate} onUpdate={onUpdate} canLock={rx.canLock} />}>
      <form onSubmit={form.onSubmit(handleSubmit)} className={classes.form}>
        <button hidden={true} ref={refSub} type={'submit'} />
        {rx.renderForm(form)}
      </form>
      {!isNew && <Container fluid={true} sx={{ paddingTop:10 }}>{rx.children}</Container>}
    </EntityView>
  );
};
