import { LabelControl, LinkControl } from './LinkControl';
import { LookupControl } from './LookupControl';
import { ISchemaFieldProps } from './SchemaFieldFactory';


export const HeaderFieldFactory = (rx: ISchemaFieldProps) => {
  switch (rx.field.fieldType) {
    case 23:
      return <LabelControl {...rx}/>
    default:
      return <LinkControl {...rx} />;
  }
};





