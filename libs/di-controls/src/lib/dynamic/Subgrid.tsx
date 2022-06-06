import { createRef } from 'react';
import { SchemaListRef, SchemaListTable } from '../tables';
import { ISchemaFieldProps } from './SchemaFieldFactory';

export const SubgridControl = (rx: ISchemaFieldProps) => {
  const { field } = rx;

  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  
  return (
   <SchemaListTable mode="SUBGRID"
        ref={listRef}
        schemas={[
          { label: '', value: `${field.viewId}` },
        ]}
      />
  );
};
