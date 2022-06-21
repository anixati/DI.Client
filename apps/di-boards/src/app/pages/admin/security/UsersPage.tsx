import { PageView, SchemaForm, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const UsersPage: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="User Management" desc="Manage application Users" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New User" schema="appuser" onClose={onClose} />}>
      <SchemaListTable ref={listRef} schemas={[{ label: 'Current Users', value: 'UserList' }]} />
    </PageView>
  );
};

export const UserDetailsPage: React.FC = () => {
  const { entityId } = useParams();
  return <SchemaForm title="User Details"  listUrl="/admin/users"
  schema="appuser" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
