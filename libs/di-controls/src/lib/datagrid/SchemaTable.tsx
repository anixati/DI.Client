import { getErrorMsg, ISchemaDef } from '@dotars/di-core';
import { Alert, LoadingOverlay } from '@mantine/core';
import React, { forwardRef, ReactNode, useContext } from 'react';
import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import { Column } from 'react-table';
import { getTableSchema } from './api';
import { DateCol, LinkCol, SelectBox } from './controls';
import { RenderDataGrid } from './Datagrid';
import { ColList, SchemaContext, SchemaListRef } from './types';

export interface SchemaTableProps {
  schemaName: string;
  renderCmds?: () => ReactNode;
  entityId?: string;
  showHeader: boolean;
  selectedIds:string[];
}

export const SchemaTable = forwardRef<SchemaListRef, SchemaTableProps>((rx, ref) => {
  const { isLoading, error, data, isSuccess } = useQuery([rx.schemaName], async () => await getTableSchema(rx.schemaName), { keepPreviousData: false, staleTime: 0 });
  const { mode } = useContext(SchemaContext);
  const location = useLocation();

  const createCols = (data: ISchemaDef): ColList => {
    const hc: Array<string> = [];
    let cols = data.columns.map((x) => {
      if (x.type === 1) hc.push(x.accessor);
      if (x.type === 2) {
        hc.push(x.accessor);
        return LinkCol(x, location.pathname);
      }
      if (x.type === 3) {
        hc.push(x.accessor);
        return DateCol(x);
      }
      return { Header: x.Header, accessor: x.accessor, width: x.width };
    });
    //TODO: --- fix duplicate issue
    if (mode === 'LOOKUP') {
      cols = [
        {
          id: 'selection',
          accessor: `id`,
          Header: '', //({ getToggleAllRowsSelectedProps }) => <div></div>,
          Cell: ({ row }) => <SelectBox name={''} {...row.getToggleRowSelectedProps()} />,
        },
        ...cols,
      ];
    }
    return { hc, cols };
  };

  return (
    <>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && data && <RenderDataGrid ref={ref} queryKey={rx.schemaName} cols={createCols(data)}
       schema={data} renderCmds={rx.renderCmds} 
       selectedIds={rx.selectedIds}
       entityId={rx.entityId} showHeader={rx.showHeader} />}
    </>
  );
});
