import { IEntity, useEntityContext } from '@dotars/di-core';
import { useForm } from '@mantine/form';
import { UseFormInput, UseFormReturnType } from '@mantine/form/lib/use-form';
import { useEffect, useRef } from 'react';
import { EntityBar } from './EntityBar';
import { EntityView } from './EntityView';

export interface EntityFormProps<T> {
  stateUrl: string;
  config: UseFormInput<T>;
  submitData: (values: T) => void;
  renderForm:(form:UseFormReturnType<T>) =>React.ReactNode;
}

export const EntityForm = <T extends IEntity>( rx: EntityFormProps<T>) => {
  const form = useForm<T>(rx.config);
  const ectx = useEntityContext();
  useEffect(() => {
    form.clearErrors();
    if (ectx?.entity) {
      form.setValues(ectx.entity as T);
    } else {
      form.reset();
    }
  }, [ectx]);
  const refSub = useRef<HTMLButtonElement>(null);
  const onUpdate = () => {
    form.clearErrors();
    form.validate();
    if (Object.keys(form.errors).length === 0) refSub?.current?.click();
  };
  const onCreate = () => {
    form.clearErrors();
    form.validate();
    if (Object.keys(form.errors).length === 0) refSub?.current?.click();
  };
  const handleSubmit = (values: typeof form.values) => {
    const data = values as T;
    if (data) rx.submitData(data);
  };
  return (
    <EntityView name="Option" toolBar={<EntityBar url={rx.stateUrl} OnCreate={onCreate} onUpdate={onUpdate} />}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <button hidden={true} ref={refSub} type={'submit'} />
        {rx.renderForm(form)}
      </form>
    </EntityView>
  );
};
