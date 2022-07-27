import { Select } from '@mantine/core';
import { FLDWIDTH, ISchemaFieldProps } from './SchemaFieldFactory';
import kvJson from '../data/lists.json';

export type KeyValType = typeof kvJson;

export const TextlistControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  const data = kvJson.find((x) => x.key === field.viewId);
  return (
    <Select
      required={field.required ? field.required : false}
      styles={{
        disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
      }}
      label={field.title}
      nothingFound="No options"
      clearable={!rx.disabled}
      disabled={rx.disabled}
      placeholder={`Select one option`}
      style={{ marginTop: 10, width: `${rx.width ? rx.width : FLDWIDTH}%` }}
      value={values[rx.field.key]}
      error={errors[rx.field.key]}
      onChange={(v) => fieldChanged(rx.field.key, v)}
      size="xs"
      data={data ? data.values : []}
      defaultValue={field.options}
    />
  );
};
