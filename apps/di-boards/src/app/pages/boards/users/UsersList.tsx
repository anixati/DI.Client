import { PageView, SchemaListRef, SchemaListTable } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const UsersList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  return (
    <PageView title="User's" desc="Application Users" icon={<Receipt />} >
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Current Users', value: 'ActiveUsers' },
          { label: 'Previous Users', value: 'InActiveUsers' },
        ]}
      />
    </PageView>
  );
};
