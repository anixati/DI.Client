import { Group } from '@mantine/core';
import { ISchemaFieldProps, SchemaFieldFactory } from './SchemaFieldFactory';


export const SchemaFieldGroup = (rx: ISchemaFieldProps) => {
  return (
    <Group key={rx.field.key} spacing={12} position="left">
      {rx.field.fields.map((field) => {
        return <SchemaFieldFactory key={field.key} field={field} fieldChanged={rx.fieldChanged} values={rx.values} />;
      })}
    </Group>
  );
};
