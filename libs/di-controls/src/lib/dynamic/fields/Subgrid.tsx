import { Group, SelectItem } from '@mantine/core';
import { createRef } from 'react';
import { ISchemaFieldProps } from './SchemaFieldFactory';
import { ActionFormBtn } from '../ActionFormBtn';
import { DocumentGrid } from './DocumentGrid';
import { SchemaListRef, SchemaListTable } from '../../datagrid';

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
      return <DocumentGrid {...rx} />;
    default: {
      const scl: Array<SelectItem> = [];
      const options: Partial<Array<SelectItem>> = JSON.parse(String(field.options));
      for (const opt of options) {
        if (opt) scl.push({ label: opt.label, value: opt.value });
      }
      return <SchemaListTable mode="SUBGRID" ref={listRef} schemas={scl} renderCmds={() => <Actions />} />;
    }
  }
};
