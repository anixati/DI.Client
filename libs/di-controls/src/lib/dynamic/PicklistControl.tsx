import { ISelectedItem } from '@dotars/di-core';
import { Select } from '@mantine/core';
import { createRef, useEffect, useState } from 'react';
import { SchemaListRef } from '../tables';
import { ISchemaFieldProps } from './SchemaFieldFactory';

export const PicklistControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  // const [select, setSelect] = useState<ISelectedItem | undefined>(undefined);
  // useEffect(() => {
  //   const cx = values[rx.field.key];
  //   if (cx && cx.length > 0) {
  //     setSelect(JSON.parse(cx));
  //   } else {
  //     setSelect(undefined);
  //   }
  // }, [values[rx.field.key]]);

  // const clickOn = () => {};
  // const onSelect = () => {};
  return (<Select required={field.required ? field.required : false} label={field.title}  searchable
    nothingFound="No options" clearable 
  placeholder={`Select one option`} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }} 
  value={values[rx.field.key]} 
  error={errors[rx.field.key]} 
  onChange={(v) => fieldChanged(rx.field.key, v)} size="xs" data={field.options} />);
};
