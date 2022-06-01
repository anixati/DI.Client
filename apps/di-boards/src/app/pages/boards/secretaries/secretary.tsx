import { SchemaForm } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const SecretaryPage: React.FC = () => {
  const { entityId } = useParams();

  return <SchemaForm title="Asst. Secretary Details"  listUrl="/boards/secretaries"
  schema="secretary" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
