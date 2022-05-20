import { PagedTable, PageView, ScrollPanel } from '@dotars/di-controls';
import { IAuditLog, IAuditProp, IEntity } from '@dotars/di-core';
import { ActionIcon, Grid, Group, Table, Text } from '@mantine/core';
import moment from 'moment';
import { useState } from 'react';
import { CellProps, Column } from 'react-table';
import { Eye, Receipt } from 'tabler-icons-react';

export const AppointeeList: React.FC = () => {
  const createItem = () => {
    console.log('.');
  };
  const viewItem = (row: IAuditLog) => {};

  const columns: Array<Column<IEntity>> = [
    {
      Header: 'Id',
      accessor: 'id',
      width: 50,
    }
  ];

  return (
    <PageView title="Audit Logs" desc="" icon={<Receipt />}>
      <PagedTable<IEntity> title="Audit logs" OnCreate={createItem} columns={columns} canCreate={false} baseUrl="/audits" />
    </PageView>
  );
};
