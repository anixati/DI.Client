import { NumberInput, Radio, RadioGroup, Select } from '@mantine/core';
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
      clearable
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

export const RadioGroupControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  return (
    <RadioGroup required={field.required ? field.required : false} color="cyan" label={field.title} description={field.description} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }} value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e)} size="sm">
      <Radio value="1" label="Yes" disabled={rx.disabled} />
      <Radio value="0" label="No" disabled={rx.disabled} />
    </RadioGroup>
  );
};

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
      value={values[field.key]?Number(values[field.key]):undefined}
      error={errors[field.key]}
      onChange={(val) => fieldChanged(field.key, val)}
      precision={2}
      min={0}
      step={0.05}
      size="xs"
      color="cyan"
    />
  );
};


