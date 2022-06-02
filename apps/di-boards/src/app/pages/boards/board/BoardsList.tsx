import { PageView, SchemaListRef, SchemaListTable, SchemaWizardForm } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const BoardsList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };

  return (
    <PageView title="Boards" desc="" icon={<Receipt />} renderCmds={() => <SchemaWizardForm title="New Board"
     schema="boards" onClose={onClose}  />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active Boards', value: 'ActiveBoards' },
          // { label: 'Current Vacancies', value: 'CurrentVacancies' },
          // { label: 'Upcoming Vacancies', value: 'UpcomingVacancies' },
          { label: 'Inactive Boards', value: 'InActiveBoards' },
        ]}
      />
    </PageView>
  );
};




