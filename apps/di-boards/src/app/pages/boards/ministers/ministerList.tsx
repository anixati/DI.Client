import { PageView, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const MinisterList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Ministers" desc="" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Minister"
     schema="minister" onClose={onClose}  />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active Ministers', value: 'ActiveMinisters' },
          { label: 'Inactive Ministers', value: 'InActiveMinisters' },
        ]}
      />
    </PageView>
  );
};
