import { FieldHookConfig, FieldInputProps, FieldMetaProps } from 'formik';
import { FieldProps } from './FieldProps';


export interface wrapperProps<T = unknown> {
  opr: FieldProps & FieldHookConfig<T>;
  renderFld: (uid: string, field: FieldInputProps<T>, meta?: FieldMetaProps<T>) => React.ReactNode;
}
