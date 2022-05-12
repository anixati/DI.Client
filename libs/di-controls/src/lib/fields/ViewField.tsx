import { Input } from '@mantine/core';
import { FieldHookConfig } from 'formik';
import { FieldProps } from './FieldProps';
import { Wrapper } from './DataField';


export const ViewField = (rx: FieldProps & FieldHookConfig<string>) => {
  return (
    <Wrapper
      opr={rx}
      renderFld={(uid, field) => {
        return <Input id={uid} {...field} variant="filled" disabled size="xs" />;
      }} />
  );
};
