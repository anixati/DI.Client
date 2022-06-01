import { PageView, SchemaListRef, SchemaListTable, SchemaWizardForm } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const SecretaryList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Appointees" desc="" icon={<Receipt />} renderCmds={() => <SchemaWizardForm title="New Secretary"
     schema="secretary" onClose={onClose}  />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active Secretaries', value: 'ActiveSecretaries' },
          { label: 'Inactive Secretaries', value: 'InActiveSecretaries' },
        ]}
      />
    </PageView>
  );
};
