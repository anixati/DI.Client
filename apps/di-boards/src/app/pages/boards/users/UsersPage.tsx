import { SchemaForm } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const UsersPage: React.FC = () => {
  const { entityId } = useParams();

  return <SchemaForm title="User Details"  listUrl="/boards/appusers"
  schema="user" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
