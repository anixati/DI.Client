import { PageView, SchemaTable } from '@dotars/di-controls';
import { Button, Group } from '@mantine/core';
import { Receipt } from 'tabler-icons-react';
import { appStyles } from '../../../Styles';

export const VacanciesPage: React.FC = () => {
  const { classes } = appStyles();
  const createItem = () => {
    console.log('.');
  };

  return (
    <PageView
      title="Current Vacancies"
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
