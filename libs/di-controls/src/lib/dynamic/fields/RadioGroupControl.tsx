import { Radio, RadioGroup, Select } from '@mantine/core';
import { FLDWIDTH, ISchemaFieldProps } from './SchemaFieldFactory';


export const RadioGroupControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  // return (
  //   <RadioGroup required={field.required ? field.required : false} color="cyan" label={field.title} description={field.description} 
  //   style={{ marginTop: 10, width: `${rx.width ? rx.width  : FLDWIDTH}%` }}
  //   value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e)} size="sm">
  //     <Radio value="1" label="Yes" disabled={rx.disabled} />
  //     <Radio value="0" label="No" disabled={rx.disabled} />
  //   </RadioGroup>
  // );

  return (
    <Select
      required={field.required ? field.required : false}
      styles={{
        disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
      }}
      label={field.title}
      nothingFound="No options"
      clearable={!rx.disabled}
      disabled={rx.disabled || field.disabled}
      placeholder={`Select one option`}
      style={{ marginTop: 10, width: `${rx.width ? rx.width  : FLDWIDTH}%` }}
      value={values[rx.field.key]}
      error={errors[rx.field.key]}
      onChange={(v) => fieldChanged(rx.field.key, v)}
      size="xs"
      data={[
        { value: '1', label: 'Yes' },
        { value: '0', label: 'No' },
      ]}
    />
  );

};
