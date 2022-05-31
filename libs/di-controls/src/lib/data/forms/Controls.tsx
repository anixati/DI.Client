import { IFormSchemaField } from '@dotars/di-core';
import { Group, NumberInput, Radio, RadioGroup, Select, Textarea, TextInput } from '@mantine/core';
import { useContext } from 'react';
import { formStyles } from '../styles/FormStyles';
import { WizardContext } from './FormContext';

export interface IFieldProps {
  field: IFormSchemaField;
  fieldChanged: (key: string, value: any) => void;
  values: Record<string, any>;
}

export const WizField = (rx: IFieldProps) => {
  const { errors } = useContext(WizardContext);
  const { field, fieldChanged, values } = rx;
  const ph = `Please enter ${field.title}`;
  switch (rx.field.fieldType) {
    case 1:
      return <Textarea required={field.required ? field.required : false} label={field.title} placeholder={ph} style={{ marginTop: 10 }} value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)} size="xs" autosize minRows={3} />;
    case 2:
      return <NumberInput required={field.required ? field.required : false} label={field.title} placeholder={ph} style={{ marginTop: 10 }} value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(val) => fieldChanged(rx.field.key, val)} size="xs" />;
    case 3:
      return (
        <RadioGroup required={field.required ? field.required : false} label={field.title} description={field.description} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }} value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e)} size="sm">
          <Radio value="1" label="Yes" />
          <Radio value="0" label="No" />
        </RadioGroup>
      );
    case 7:
      return <Select required={field.required ? field.required : false} label={field.title} placeholder={`Select one option`} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%`  }} value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(v) => fieldChanged(rx.field.key, v)} size="xs" data={field.options} />;
    default:
      return <TextInput required={field.required ? field.required : false} label={field.title} placeholder={ph} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }} error={errors[rx.field.key]} value={values[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)} size="xs" />;
  }
};

export const WizGroup = (rx: IFieldProps) => {
  const { classes } = formStyles();
  return (
    <Group key={rx.field.key} spacing={12} position="left">
      {rx.field.fields.map((field) => {
        return <WizField key={field.key} field={field} fieldChanged={rx.fieldChanged} values={rx.values} />;
      })}
    </Group>
  );
};
