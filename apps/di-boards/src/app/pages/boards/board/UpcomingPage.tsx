import { PagedTable, PageView } from '@dotars/di-controls';
import { IColumnDef, IDataResponse, IEntity, ITableDef } from '@dotars/di-core';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Column } from 'react-table';
import { Receipt } from 'tabler-icons-react';

interface IModel extends IEntity {
  GroupName: string;
  OptionId: number;
  Order: number;
  Label: string;
  Value: number;
}

export const UpcomingPage: React.FC = () => {
  const [cols, setCols] = useState<Column<any>[]>([]);

  const getConfig = useCallback(async () => {
    const resp = await axios.get<IDataResponse<ITableDef>>('/qry/schema/optionsets');
    if (resp.data?.result?.schema) {
      console.log('-#-',resp.data?.result?.schema);

      const cols: Array<Column<any>> = [];
      resp.data?.result?.schema.columns.map((s) => {
        cols.push({
          Header: s.Header,
          accessor: s.accessor,
          width: s.width,
        });
      });
console.log('--',cols);
      setCols(cols);
    }
  }, []);
  useEffect(() => {
    getConfig();
  }, [getConfig]);

  const createItem = () => {
    console.log('.');
  };


  return (
    <PageView title="Audit Logs" desc="" icon={<Receipt />}>
      <PagedTable<any> title="Audit as" OnCreate={createItem} columns={cols} canCreate={false} baseUrl="/qry/schema/optionsets" />
    </PageView>
  );
};
