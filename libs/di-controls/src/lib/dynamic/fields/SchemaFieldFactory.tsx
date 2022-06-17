import { IFormSchemaField } from '@dotars/di-core';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { LookupControl } from './LookupControl';
import { PicklistControl } from './PicklistControl';
import { DecimalControl } from "./DecimalControl";
import { RadioGroupControl } from "./RadioGroupControl";
import { DatePickerControl } from "./DatePickerControl";

export interface ISchemaFieldProps {
  field: IFormSchemaField;
  fieldChanged: (key: string, value: any) => void;
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: boolean;
  readonly?: boolean;
}

export const SchemaFieldFactory = (rx: ISchemaFieldProps) => {
  //const { errors } = useContext(WizardFormContext);
  const { field, fieldChanged, values, errors } = rx;
  const ph = `Please enter ${field.title}`;
  switch (rx.field.fieldType) {
    case 1:
      return (
        <Textarea
          required={field.required ? field.required : false}
          label={field.title}
          styles={{
            disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
          }}
          disabled={rx.disabled}
          placeholder={ph}
          //style={{ marginTop: 10 }}
          value={values[rx.field.key]}
          error={errors[rx.field.key]}
          style={{ marginTop: 10, width: `98.5%` }}
          onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)}
          size="xs"
          autosize
          minRows={3}
        />
      );
    case 2:
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
          error={errors[rx.field.key]}
          onChange={(val) => fieldChanged(rx.field.key, val)}
          size="xs"
          color="cyan"
        />
      );
    case 3:
      return <RadioGroupControl {...rx} />;
    case 6:
      return <DatePickerControl {...rx} />;
    case 11:
      return <DecimalControl {...rx} />;
    case 7:
      return (
        <Select
          required={field.required ? field.required : false}
          styles={{
            disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
          }}
          disabled={rx.disabled}
          label={field.title}
          placeholder={`Select one option`}
          style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }}
          value={values[rx.field.key]}
          error={errors[rx.field.key]}
          onChange={(v) => fieldChanged(rx.field.key, v)}
          size="xs"
          data={field.options}
        />
      );
    case 8:
      return <LookupControl {...rx} />;
    case 9:
      return <PicklistControl {...rx} />;
    default:
      return (
        <TextInput
          required={field.required ? field.required : false}
          disabled={rx.disabled}
          label={field.title}
          placeholder={ph}
          styles={{
            disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
          }}
          style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }}
          error={errors[rx.field.key]}
          value={values[rx.field.key]}
          onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)}
          size="xs"
        />
      );
  }
};
