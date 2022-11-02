import { PageView, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const SecretaryList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Assistant Secretaries" desc="" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Secretary"
     schema="secretary" onClose={onClose}  />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active List', value: 'ActiveSecretaries' },
          { label: 'Inactive List', value: 'InActiveSecretaries' },
        ]}
      />
    </PageView>
  );
};
