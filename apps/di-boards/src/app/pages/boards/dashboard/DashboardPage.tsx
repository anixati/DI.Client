import { Container, Grid, Skeleton } from '@mantine/core';
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
    <Container fluid={true}>
      <Grid grow>
        <Grid.Col xs={12}>
          <StatsGrid {...stats} />
        </Grid.Col>

        {/* <Grid.Col xs={4}>{child}</Grid.Col>
        <Grid.Col xs={8}>{child}</Grid.Col> */}

        {/* <Grid.Col xs={3}>{child}</Grid.Col>
        <Grid.Col xs={3}>{child}</Grid.Col>
        <Grid.Col xs={6}>{child}</Grid.Col> */}
      </Grid>
    </Container>
  );
};
