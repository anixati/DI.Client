import { SchemaForm } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';




export const BoardsPage: React.FC = () => {
  const { entityId } = useParams();

  return <SchemaForm title="Board Details" listUrl="/boards/boards"
    schema="board" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
