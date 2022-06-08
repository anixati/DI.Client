import { NumberInput } from '@mantine/core';
import { ISchemaFieldProps } from './SchemaFieldFactory';


export const DecimalControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  return (
    <NumberInput
      required={field.required ? field.required : false}
      styles={{
        disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
      }}
      label={field.title}
      disabled={rx.disabled}
      placeholder={field.title}
      style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }}
      value={values[field.key] ? Number(values[field.key]) : undefined}
      error={errors[field.key]}
      onChange={(val) => fieldChanged(field.key, val)}
      precision={2}
      min={0}
      step={0.05}
      size="xs"
      color="cyan" />
  );
};
