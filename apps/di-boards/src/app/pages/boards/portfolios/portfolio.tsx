import { SchemaForm } from '@dotars/di-controls';
import { useParams } from 'react-router-dom';
import { Receipt } from 'tabler-icons-react';

export const PortfolioPage: React.FC = () => {
  const { entityId } = useParams();

  return <SchemaForm title="Portfolio Details"  listUrl="/boards/portfolios"
  schema="portfolio" entityId={entityId} icon={<Receipt />} canEdit={true} />;
};
