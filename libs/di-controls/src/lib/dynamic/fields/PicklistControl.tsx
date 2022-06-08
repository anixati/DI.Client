import { Select } from '@mantine/core';
import { ISchemaFieldProps } from './SchemaFieldFactory';

export const PicklistControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  return (
    <Select
      required={field.required ? field.required : false}
      styles={{
        disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
      }}
      label={field.title}
      searchable
      nothingFound="No options"
      clearable={!rx.disabled}
      disabled={rx.disabled}
      placeholder={`Select one option`}
      style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }}
      value={values[rx.field.key]}
      error={errors[rx.field.key]}
      onChange={(v) => fieldChanged(rx.field.key, v)}
      size="xs"
      data={field.options ? field.options : []}
    />
  );
};


