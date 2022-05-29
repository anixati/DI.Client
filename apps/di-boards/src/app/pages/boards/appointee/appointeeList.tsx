import { PageView, SchemaListTable, WzForm } from '@dotars/di-controls';
import { Receipt } from 'tabler-icons-react';
import { appStyles } from '../../../Styles';

export const AppointeeList: React.FC = () => {
  const { classes } = appStyles();

  return (
    <PageView title="Appointees" desc="" icon={<Receipt />} renderCmds={() => <WzForm title="Create new Appointee" schema="createappointee"/>}>
      <SchemaListTable
        schemas={[
          { label: 'Active Appointees', value: 'ActiveAppointees' },
          { label: 'Inactive Appointees', value: 'InActiveAppointees' },
        ]}
      />
    </PageView>
  );
};
