import { PageView, ListView } from '@dotars/di-controls';
import { Grid, Text } from '@mantine/core';

export const OptionsPage: React.FC = () => {
  return (
    <PageView title="Optionset Management" desc="Manage optionset's">
      <Grid justify="space-between">
        <Grid.Col span={4} style={{ minHeight: 280,padding:5 }}>
          <ListView title="Option Sets" />
        </Grid.Col>
        <Grid.Col span={8} >
          2
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
