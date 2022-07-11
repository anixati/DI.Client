import { PageView } from '@dotars/di-controls';
import { Container, Grid, Skeleton } from '@mantine/core';
import { Receipt } from 'tabler-icons-react';
import { StatsGrid, StatsGridProps } from './charts/StatsGrid';

const stats: StatsGridProps = {
  data: [
    { title: 'Active Boards', icon: 'receipt', value: '786', diff: 34 },
    { title: 'Current Vacancies', icon: 'coin', value: '345', diff: -13 },
    { title: 'Upcoming Vacancies', icon: 'discount', value: '24', diff: 18 },
    { title: 'Female ratio', icon: 'user', value: '23%', diff: -30 },
  ],
};

const child = <Skeleton height={140} radius="md" animate={false} />;

export const DashboardPage: React.FC = () => {
  return (
    <PageView title="Dashboard" desc="" icon={<Receipt />}>
      <Grid grow>
        <Grid.Col xs={12}>
          <StatsGrid {...stats} />
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
