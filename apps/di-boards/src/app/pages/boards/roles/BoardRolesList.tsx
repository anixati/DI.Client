import { PageView, SchemaListRef, SchemaListTable, SchemaWizardForm } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';




export const BoardRolesList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Ministers" desc="" icon={<Receipt />} renderCmds={() => <SchemaWizardForm title="New Board Role"
      schema="boardroles" onClose={onClose} />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active Ministers', value: 'ActiveMinisters' },
          { label: 'Inactive Ministers', value: 'InActiveMinisters' },
        ]} />
    </PageView>
  );
};
