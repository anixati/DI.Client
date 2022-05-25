import { PageView, SchemaTable } from '@dotars/di-controls';
import { Button, Group } from '@mantine/core';
import { Receipt } from 'tabler-icons-react';
import { appStyles } from '../../../Styles';

export const ActiveBoardsPage: React.FC = () => {
  const { classes } = appStyles();
  const createItem = () => {
    console.log('.');
  };

  return (
    <PageView
      title="Active Boards"
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
      <SchemaTable schemaName="optionsets" />
    </PageView>
  );
};
