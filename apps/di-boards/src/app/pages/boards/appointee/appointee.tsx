import { SchemaForm } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const AppointeePage: React.FC = () => {
  const { entityId } = useParams();

  return (
    <SchemaForm title="Appointee Details" schema="viewappointee" icon={<Receipt />}>
    {entityId}
    
    </SchemaForm>
  );
};
