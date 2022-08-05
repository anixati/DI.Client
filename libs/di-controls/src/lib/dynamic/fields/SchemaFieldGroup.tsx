import { Group } from '@mantine/core';
import { FieldStyles } from './FieldStyles';
import { ISchemaFieldProps, SchemaFieldFactory } from './SchemaFieldFactory';

export const SchemaFieldGroup = (rx: ISchemaFieldProps) => {
  const { classes } = FieldStyles();
  const fc = rx.field.fields.length;
  let width = 0;
  switch (fc) {
    case 2: {
      width = 49;
      break;
    }
    case 3: {
      width =32;
      break;
    }  case 4: {
      width =24;
      break;
    }
    case 5: {
      width =18;
      break;
    }
    case 6: {
      width =14;
      break;
    }
    default: {
      width = 100;
      break;
    }
  }
  return (
    <Group key={rx.field.key} spacing={12} position="apart" className={classes.FieldGroup}>
      {rx.field.fields.map((field) => {
        return <SchemaFieldFactory key={field.key} field={field} fieldChanged={rx.fieldChanged} width={width} values={rx.values} errors={rx.errors} disabled={rx.disabled} />;
      })}
    </Group>
  );
};



export const SchemaFieldItem = (rx: ISchemaFieldProps) => {
  const { classes } = FieldStyles();
  return (
    <Group key={`${rx.field.key}grp`} spacing={12} position="apart" className={classes.FieldGroup}>
        <SchemaFieldFactory key={rx.field.key} field={rx.field} fieldChanged={rx.fieldChanged} 
         values={rx.values} errors={rx.errors} disabled={rx.disabled} />
    </Group>
  );
};



