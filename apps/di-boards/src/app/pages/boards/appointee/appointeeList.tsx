import { PageView, SchemaListRef, SchemaListTable, ActionFormBtn } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const AppointeeList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Appointees" desc="" icon={<Receipt />} renderCmds={() => <ActionFormBtn title="New Appointee"
     schema="appointee" onClose={onClose}  />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active List', value: 'ActiveAppointees' },
          { label: 'Inactive List', value: 'InActiveAppointees' },
        ]}
      />
    </PageView>
  );
};
