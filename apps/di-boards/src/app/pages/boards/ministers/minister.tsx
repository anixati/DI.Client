import { SchemaForm } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const MinisterPage: React.FC = () => {
  const { entityId } = useParams();

  return <SchemaForm title="Minister Details"  listUrl="/boards/ministers"
  schema="minister" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
