import { Input } from '@mantine/core';
import { FieldHookConfig } from 'formik';
import {Check, AlertCircle } from 'tabler-icons-react';
import { FieldProps } from './FieldProps';
import { Wrapper } from './DataField';


export const TextField = (rx: FieldProps & FieldHookConfig<string>) => {


  return (
    <Wrapper
      opr={rx}
      renderFld={(uid, field, meta) => {
        return <Input id={uid} {...field} size="xs" placeholder={rx.placeholder ?? `Enter ${rx.label}`} invalid={meta?.touched && meta.error !== undefined}
          rightSection={meta?.touched ? meta.error !== undefined ? <AlertCircle size={16} color="red" /> : meta.value ?<Check size={16} color="#A2D9CE" />:null : null} />;
      }} />
  );
};
