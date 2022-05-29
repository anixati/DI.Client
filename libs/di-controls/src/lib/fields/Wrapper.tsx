import { InputWrapper, Tooltip } from '@mantine/core';
import { useId } from '@mantine/hooks';
import { FieldHookConfig, FieldInputProps, FieldMetaProps, useField } from 'formik';
import { useEffect, useState } from 'react';

export interface FieldProps {
  name: string;
  label?: string;
  required?: boolean;
  desc?: string;
  width?: number;
}

export interface wrapperProps<T = unknown> {
  opr: FieldProps & FieldHookConfig<T>;
  renderFld: (uid: string, field: FieldInputProps<T>, meta?: FieldMetaProps<T>) => React.ReactNode;
}

export const Wrapper = <T=unknown>(rx: wrapperProps<T>) => {
  const [field, meta] = useField(rx.opr);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    setOpened(meta.touched && meta.error !== undefined);
  }, [meta]);
  const uid = useId();
  return (
    <Tooltip opened={opened} label={meta.touched && meta.error && meta.error} color="red" position="bottom" placement="start" withArrow style={{ width: '100%' }}>
      <InputWrapper
        id={uid}
        label={rx.opr.label}
        required={rx.opr.required ? rx.opr.required : false}
        description={rx.opr.desc ? rx.opr.desc : null}
        size="xs"
        //  error={<ErrorMsg {...meta} />}
        style={{ width: rx.opr.width ? `${rx.opr.width}%` : '100%' }}
      >
        {rx.renderFld(uid, field, meta)}
      </InputWrapper>
    </Tooltip>
  );
};
