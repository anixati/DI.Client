


import { PageView, SchemaListTable } from '@dotars/di-controls';
import { Button, Group } from '@mantine/core';
import { Receipt } from 'tabler-icons-react';
import { appStyles } from '../../../Styles';

export const AppointeeList: React.FC = () => {
  const { classes } = appStyles();
  const createItem = () => {
    console.log('.');
  };

  return (
    <PageView
      title="Appointees"
      desc=""
      icon={<Receipt />}
      renderCmds={() => {
        return (
          <Button variant="filled" color="dotars" className={classes.toolButton} onClick={() => createItem()}>
          Create New
        </Button>
        );
      }}
    >
      <SchemaListTable schemas={[{label:"Active Appointees",value:"ActiveAppointees"},{label:"Inactive Appointees",value:"InActiveAppointees"}]} />
    </PageView>
  );
};
