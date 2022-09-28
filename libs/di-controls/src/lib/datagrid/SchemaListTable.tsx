import { SelectItem } from '@mantine/core';
import { forwardRef, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SchemaTable } from "./SchemaTable";
import { RenderMode, SchemaContext, SchemaListRef } from './types';


export interface SchemaListTableProps {
  schemas: Array<SelectItem>;
  renderCmds?: () => ReactNode;
  mode?: RenderMode;
  showHeader?: boolean;
  selectedIds?:string[];
}
export const SchemaListTable = forwardRef<SchemaListRef, SchemaListTableProps>((rx, ref) => {
  const [schema, setSchema] = useState<string>(rx.schemas[0].value);
  const [schemas] = useState<Array<SelectItem>>(rx.schemas);
  const [mode, ] = useState<RenderMode>(rx.mode ? rx.mode : 'DEFAULT');
  const { entityId } = useParams();
  useEffect(() => {
    if (rx.mode && rx.mode === 'SUBGRID' && (entityId === undefined || entityId.length <= 0))
      throw new Error('Subgrid must have valid entity id');
  }, [rx.mode, entityId]);
  const changeSchema = (name: string) => {
    setSchema(name);
  };
  return (
    <SchemaContext.Provider value={{ mode, schema, schemas, changeSchema }}>
      <SchemaTable ref={ref} schemaName={schema} renderCmds={rx.renderCmds} entityId={entityId} 
      showHeader={rx.showHeader !== undefined ? rx.showHeader : true} 
      selectedIds={rx.selectedIds !== undefined?rx.selectedIds:[] as string[]}
      />
    </SchemaContext.Provider>
  );
});
