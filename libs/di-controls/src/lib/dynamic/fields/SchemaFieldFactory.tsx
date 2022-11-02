import { IFormSchemaField } from '@dotars/di-core';
import { NumberInput, Select, Textarea, TextInput } from '@mantine/core';
import { LookupControl } from './LookupControl';
import { PicklistControl } from './PicklistControl';
import { DecimalControl, NumericControl } from './DecimalControl';
import { RadioGroupControl } from './RadioGroupControl';
import { DatePickerControl } from './DatePickerControl';
import { TextlistControl } from './TextlistControl';
import { HyperLinkControl } from "./HyperLinkControl";

export const FLDWIDTH = 100;
export interface ISchemaFieldProps {
  field: IFormSchemaField;
  fieldChanged: (key: string, value: any) => void;
  values: Record<string, any>;
  errors: Record<string, any>;
  disabled: boolean;
  readonly?: boolean;
  width?: number;
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
          disabled={rx.disabled || field.disabled}
          placeholder={ph}
          //style={{ marginTop: 10 }}
          value={values[rx.field.key]}
          error={errors[rx.field.key]}
          style={{ marginTop: 10, width: `${rx.width ? rx.width : 100}%` }}
          onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)}
          size="xs"
          autosize
          minRows={3}
        />
      );
    case 2:
      return <NumericControl {...rx} />;
    case 3:
      return <RadioGroupControl {...rx} />;
    case 6:
      return <DatePickerControl {...rx} />;
    case 11:
      return <DecimalControl {...rx} />;
    // case 23:
    //   return <LabelControl {...rx} />;
    case 7:
      return (
        <Select
          required={field.required ? field.required : false}
          styles={{
            disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
          }}
          disabled={rx.disabled || field.disabled}
          label={field.title}
          placeholder={`Select one option`}
          style={{ marginTop: 10, width: `${rx.width ? rx.width : 100}%` }}
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
    case 12:
      return <TextlistControl {...rx} />;
    case 13:
      return (
        <TextInput
          required={false}
          variant="unstyled"
          disabled={true}
          label=" "
          placeholder=" "
          styles={{
            disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
          }}
          style={{ marginTop: 10, width: `${rx.width ? rx.width : 100}%` }}
          value=""
          size="xs"
        />
      );
      case 25:
        return <HyperLinkControl {...rx}/>
    default:
      return (
        <TextInput
          required={field.required ? field.required : false}
          disabled={rx.disabled || field.disabled}
          label={field.title}
          placeholder={ph}
          styles={{
            disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
          }}
          style={{ marginTop: 10, width: `${rx.width ? rx.width : 100}%` }}
          error={errors[rx.field.key]}
          value={values[rx.field.key]}
          onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)}
          size="xs"
        />
      );
  }
};
