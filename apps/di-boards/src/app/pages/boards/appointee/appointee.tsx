import { SchemaForm } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const AppointeePage: React.FC = () => {
  const { entityId } = useParams();

  return <SchemaForm title="Appointee Details"  
  schema="appointee" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
