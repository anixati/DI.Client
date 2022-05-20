import { PagedTable, PageView } from '@dotars/di-controls';
import { IEntity } from '@dotars/di-core';
import { ActionIcon } from '@mantine/core';
import { CellProps, Column } from 'react-table';
import { Eye, Receipt } from 'tabler-icons-react';

interface IModel extends IEntity {
  GroupName: string;
  OptionId: number;
  Order: number;
  Label: string;
  Value: number;
}

export const ActiveBoardsPage: React.FC = () => {
  const createItem = () => {
    console.log('.');
  };

  const columns: Array<Column<IModel>> = [
    {
      Header: 'Id',
      accessor: 'id',
      width: 50,
    },
    {
      Header: 'Group Name',
      accessor: 'GroupName',
      width: 150,
    },
    {
      Header: 'Option Id',
      accessor: 'OptionId',
      width: 100,
    },
    {
      Header: 'Order',
      accessor: 'Order',
      width: 90,
    },
    {
      Header: 'Label',
      accessor: 'Label',
      width: 90,
    },
    {
      Header: 'Value',
      accessor: 'Value',
      width: 90,
    },
  ];



  
  return (
    <PageView title="Audit Logs" desc="" icon={<Receipt />}>
      <PagedTable<IModel> title="Audit as" OnCreate={createItem} columns={columns} canCreate={false} baseUrl="/qry/schema/optionsets" />
    </PageView>
  );
};
