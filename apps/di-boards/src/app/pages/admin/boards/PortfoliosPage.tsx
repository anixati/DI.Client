import { PageView } from "@dotars/di-controls";
import { Grid } from "@mantine/core";
import { Receipt } from "tabler-icons-react";



export const PortfolioPage: React.FC = () => {
  return (
    <PageView title="Portfolio's" desc="" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={12} style={{ minHeight: 280, padding: 5 }}>

        </Grid.Col>
      </Grid>
    </PageView>
  );
};
