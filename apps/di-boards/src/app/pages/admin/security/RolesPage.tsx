import { PageView, SchemaForm, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const RolesPage: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Role Management" desc="Manage application Roles" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Role" schema="approle" onClose={onClose} />}>
      <SchemaListTable ref={listRef} schemas={[{ label: 'Current Roles', value: 'RolesList' }]} />
    </PageView>
  );
};

export const RoleDetailsPage: React.FC = () => {
  const { entityId } = useParams();
  return <SchemaForm title="Role Details"  listUrl="/admin/roles"
  schema="approle" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
