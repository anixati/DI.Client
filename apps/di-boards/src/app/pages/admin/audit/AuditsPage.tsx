import { DataTable, PagedTable, PageView } from '@dotars/di-controls';
import { IAuditLog, IAuditProp, IGenericListResponse } from '@dotars/di-core';
import { ActionIcon, Grid, Table } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useAsync } from 'react-async-hook';
import { CellProps, Column } from 'react-table';
import { AlertOctagon, Eye, Receipt } from 'tabler-icons-react';

export const AuditsPage: React.FC = () => {
  // const getAuditData = async () => {
  //   const resp = await axios.post<IGenericListResponse<IAuditLog>>('/audits', { index: 0, size: 10 });
  //   const data = resp.data;
  //   if (resp.data.failed) {
  //     console.log(resp.data);
  //     showNotification({ message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
  //   }
  //   return data;
  // };
  // const asyncApi = useAsync(getAuditData, []);
  // useEffect(() => {
  //   asyncApi.execute();
  // }, []);

  const createItem = () => {
    console.log('.');
  };

  const [auditProps, setAuditProps] = useState<Array<IAuditProp> | undefined>(undefined);
  const viewItem = (row: IAuditLog) => {
    setAuditProps(row.data);
  };

  const columns: Array<Column<IAuditLog>> = [
    {
      Header: 'Id',
      accessor: 'id',
      width: 50,
    },
    {
      Header: 'Action',
      accessor: 'action',
      width: 150,
    },
    {
      Header: 'Table',
      accessor: 'tableName',
      width: 150,
    },
    {
      Header: 'Date',
      //accessor: 'auditDate',
      accessor: (d) => {
        return moment(d.auditDate).local().format('DD/MM/YYYY hh:mm:ss');
      },
      width: 150,
    },
    {
      Header: '', // No header
      id: 'edit_action', // It needs an ID
      Cell: ({ row }: CellProps<IAuditLog>) => (
        <ActionIcon size="xs" variant="light" color="blue" onClick={() => viewItem(row.original)}>
          <Eye size={16} />
        </ActionIcon>
      ),
    },
  ];

  const rows = auditProps && auditProps.map((e) => (
    <tr key={e.key}>
      <td>{e.key}</td>
      <td>{e.oldValue?e.oldValue:''}</td>
      <td>{e.newValue?e.newValue:''}</td>
    </tr>
  ));

  return (
    <PageView title="Audit Logs" desc="" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={6} style={{ minHeight: 280, padding: 5 }}>
          <PagedTable<IAuditLog> title="Audit logs"  OnCreate={createItem}  columns={columns} canCreate={false} baseUrl="/audits"/>
        </Grid.Col>
        <Grid.Col span={6} style={{ minHeight: 280, padding: 5 }}>
          {auditProps && (
            <Table striped highlightOnHover verticalSpacing={2} fontSize="xs" horizontalSpacing={2}>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Old Value</th>
                  <th>New Value</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          )}
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
