import { ISelectedItem } from '@dotars/di-core';
import { SelectItem } from '@mantine/core';
import { createContext } from 'react';
import { Column } from 'react-table';

export interface SchemaListRef {
  refresh(): void;
  getSelectedRow(): ISelectedItem | null;
  getSelectedRows(): Array<ISelectedItem> | null;
}

export type RenderMode = 'DEFAULT' | 'LOOKUP' | 'SUBGRID' | 'MULTISELECT';

export interface ISchemaContext {
  mode: RenderMode;
  schema: string;
  schemas: Array<SelectItem>;
  changeSchema?: (name: string) => void;
}

export const SchemaContext = createContext<ISchemaContext>({ mode: 'DEFAULT', schema: '', schemas: [] });

export interface IIndeterminateInputProps {
  indeterminate?: boolean;
  name: string;
}

export type ColList = {
  hc: Array<string>;
  cols: Column<any>[];
};
