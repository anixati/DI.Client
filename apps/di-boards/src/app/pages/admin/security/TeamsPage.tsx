import { PageView, SchemaForm, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const TeamsPage: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Teams Management" desc="Manage application Teams" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Team" schema="appteam" onClose={onClose} />}>
      <SchemaListTable ref={listRef} schemas={[{ label: 'Current Teams', value: 'TeamsList' }]} />
    </PageView>
  );
};

export const TeamDetailsPage: React.FC = () => {
  const { entityId } = useParams();
  return <SchemaForm title="Team Details"  listUrl="/admin/teams"
  schema="appteam" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
