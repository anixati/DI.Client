import { DatePicker } from '@mantine/dates';
import moment from 'moment';
import { Calendar } from 'tabler-icons-react';
import { FLDWIDTH, ISchemaFieldProps } from './SchemaFieldFactory';

export const DatePickerControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;

  const onChange = (val: Date | null) => {
    if (val !== null) {
      const dtStr = moment(val).format('LLLL');
      fieldChanged(field.key, dtStr);
    } else {
      fieldChanged(field.key, null);
    }
  };
  
  return (
    <DatePicker
      required={field.required ? field.required : false}
      styles={{
        disabled: { opacity: '0.9 !important', color: 'black !important', backgroundColor: '#f9fafb !important' },
      }}
      label={field.title}
      disabled={rx.disabled || field.disabled}
      placeholder={field.title}
      style={{ marginTop: 10, width: `${rx.width ? rx.width  : FLDWIDTH}%` }}
      value={values[rx.field.key] ? new Date(Date.parse(values[rx.field.key])) : null}
      size="xs"
      error={errors[rx.field.key]}
      inputFormat="DD/MM/YYYY"
      icon={<Calendar size={16} />}
      onChange={onChange}
    />
  );
};
