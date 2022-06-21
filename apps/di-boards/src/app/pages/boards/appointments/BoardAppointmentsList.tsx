import { PageView, SchemaForm, SchemaListRef, SchemaListTable } from '@dotars/di-controls';
import { createRef } from 'react';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';




export const BoardAppointmentList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Appointments" desc="" icon={<Receipt />} >
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Active Appointments', value: 'RoleAppointmentsView' }
        ]} />
    </PageView>
  );
};



export const BoardAppointmentPage: React.FC = () => {
  const { entityId } = useParams();
  return <SchemaForm title="Appointment Details" listUrl="/boards/appointments"
    schema="boardappointment" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
