import { PageView, SchemaTable } from '@dotars/di-controls';
import { IEntity } from '@dotars/di-core';
import { Receipt } from 'tabler-icons-react';

export const VacanciesPage: React.FC = () => {
  const createItem = () => {
    console.log('.');
  };

  return (
    <PageView title="Current Vacancies" desc="" icon={<Receipt />}>
      <SchemaTable schemaName="optionsets" />
    </PageView>
  );
};
