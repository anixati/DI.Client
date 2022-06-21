import { PageView, SchemaForm, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';




export const BoardRolesList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Ministers" desc="" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Board Role"
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





export const BoardRolePage: React.FC = () => {
  const { entityId } = useParams();

  return <SchemaForm title="Board Role Details" listUrl="/boards/brdroles"
    schema="boardrole" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
