import { PageView, RenderList } from '@dotars/di-controls';
import { Grid } from '@mantine/core';
import { Receipt } from 'tabler-icons-react';
import { OptionDetail } from './OptionDetail';




export const OptionsPage: React.FC = () => {
  return (
    <PageView title="Optionset Management" desc="Manage optionset's" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={4} style={{ minHeight: 280, padding: 5 }}>
          <RenderList url="/options" title="Option Sets" />
        </Grid.Col>
        <Grid.Col span={8} style={{ minHeight: 280, padding: 5 }}>
          <OptionDetail />
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
