import { Group } from '@mantine/core';
import { createRef } from 'react';
import { SchemaListRef, SchemaListTable } from '../../tables';
import { ISchemaFieldProps } from './SchemaFieldFactory';
import { ActionFormBtn } from '../ActionFormBtn';
import { DocumentGrid } from './DocumentGrid';

export const SubgridControl = (rx: ISchemaFieldProps) => {
  const { field } = rx;
  const listRef = createRef<SchemaListRef>();

  const Actions = () => {
    return (
      <Group>
        {field.fields &&
          field.fields.map((fd) => {
            return (
              <ActionFormBtn
                key={fd.key}
                title={fd.title}
                schema={fd.viewId}
                onClose={() => {
                  listRef.current?.refresh(); //todo why
                  listRef.current?.refresh();
                }}
                action={fd.key}
              />
            );
          })}
      </Group>
    );
  };
  switch (field.fieldType) {
    case 24:
      return <DocumentGrid {... rx}/>;
    default:
      return <SchemaListTable mode="SUBGRID" ref={listRef} schemas={[{ label: '', value: `${field.viewId}` }]} renderCmds={() => <Actions />} />;
  }
};
