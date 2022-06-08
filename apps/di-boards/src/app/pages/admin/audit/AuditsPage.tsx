import { PagedTable, PageView, ScrollPanel } from '@dotars/di-controls';
import { IAuditLog, IAuditProp } from '@dotars/di-core';
import { ActionIcon, Button, Grid, Group, Table, Text } from '@mantine/core';
import moment from 'moment';
import { useState } from 'react';
import { CellProps, Column } from 'react-table';
import { Eye, Receipt } from 'tabler-icons-react';

export const AuditsPage: React.FC = () => {
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
      accessor: (d) => {
        return moment(d.auditDate).local().format('DD/MM/YYYY hh:mm:ss');
      },
      width: 150,
    },
    {
      Header: '', // No header
      id: 'edit_action', // It needs an ID
      Cell: ({ row }: CellProps<IAuditLog>) => (
        <Button size="xs" variant="subtle" color="cyan" compact onClick={() => viewItem(row.original)}>
         View
        </Button>
      ),
    },
  ];

  return (
    <PageView title="Audit Logs" desc="" icon={<Receipt />}>
      <Grid justify="space-between" style={{ height: '85vh' }}>
        <Grid.Col span={6} style={{ minHeight: 280, padding: 5 }}>
          <PagedTable<IAuditLog> title="Audit logs" OnCreate={createItem} columns={columns} canCreate={false} baseUrl="/audits" />
        </Grid.Col>
        <Grid.Col span={6} style={{ minHeight: 280, padding: 5 }}>
          <ScrollPanel
            rndrTitle={() => (
              <Group spacing="sm" position="left">
                <Text weight={500}>Change Details</Text>
              </Group>
            )}
          >
            {auditProps && (
              <Table striped highlightOnHover verticalSpacing={2} fontSize="xs" horizontalSpacing={2}>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Old Value</th>
                    <th>New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {auditProps &&
                    auditProps.map((e) => (
                      <tr key={e.key}>
                        <td>{e.key}</td>
                        <td>{e.oldValue ? e.oldValue : ''}</td>
                        <td>{e.newValue ? e.newValue : ''}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </ScrollPanel>
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
