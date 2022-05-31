import { PageView } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const AppointeePage: React.FC = () => {
  const { entityId } = useParams();

  return (
    <PageView title="Appointee Details" desc="Appointee Details" icon={<Receipt />}>
    {entityId}
    
    </PageView>
  );
};
