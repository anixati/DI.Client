import { PageView, SchemaListRef, SchemaListTable, SchemaWizardForm } from '@dotars/di-controls';
import { createRef } from 'react';
import { Receipt } from 'tabler-icons-react';

export const PotyfolioList: React.FC = () => {
  const listRef = createRef<SchemaListRef>();
  const onClose = () => {
    listRef.current?.refresh();
  };
  return (
    <PageView title="Portfolios" desc="" icon={<Receipt />} renderCmds={() => <SchemaWizardForm title="New Portfolio"
     schema="portfolio" onClose={onClose}  />}>
      <SchemaListTable
        ref={listRef}
        schemas={[
          { label: 'Current Portfolios', value: 'ActivePortfolios' },
          { label: 'Previous Portfolios', value: 'InActivePortfolios' },
        ]}
      />
    </PageView>
  );
};
