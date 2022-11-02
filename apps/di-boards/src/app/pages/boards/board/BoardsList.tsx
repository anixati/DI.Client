import { PageView, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const BoardsList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };

  return (
    <PageView title="Boards" desc="" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Board"
     schema="board" onClose={onClose}  />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active List', value: 'ActiveBoards' },
          { label: 'Inactive List', value: 'InActiveBoards' },
        ]}
      />
    </PageView>
  );
};




