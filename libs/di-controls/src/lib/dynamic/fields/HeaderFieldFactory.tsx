import { LinkControl } from './LinkControl';
import { LookupControl } from './LookupControl';
import { ISchemaFieldProps } from './SchemaFieldFactory';


export const HeaderFieldFactory = (rx: ISchemaFieldProps) => {
  switch (rx.field.fieldType) {
    default:
      return <LinkControl {...rx} />;
  }
};





