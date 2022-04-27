import { Container, Grid, Skeleton } from '@mantine/core';
import { StatsSegments, StatsSegmentsProps } from './charts/segGrid';
import { StatsGrid, StatsGridProps } from './charts/StatsGrid';

const stats: StatsGridProps = {
  data: [
    { title: 'Active Boards', icon: 'receipt', value: '786', diff: 34 },
    { title: 'Current Vacancies', icon: 'coin', value: '345', diff: -13 },
    { title: 'Upcoming Vacancies', icon: 'discount', value: '24', diff: 18 },
    { title: 'Female ratio', icon: 'user', value: '23%', diff: -30 },
  ],
};

const segments: StatsSegmentsProps = {
  total: 'Active Roles: 189',
  diff: 0,
  data: [
    { label: 'Male', count: '185', part: 59, color: '#47d6ab' },
    { label: 'Female', count: '78', part: 35, color: '#03141a' },
    { label: 'Vacant', count: '46', part: 6, color: '#4fcdf7' },
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

        <Grid.Col xs={4}>
          <StatsSegments {...segments} />
        </Grid.Col>
        <Grid.Col xs={8}>{child}</Grid.Col>

        {/* <Grid.Col xs={3}>{child}</Grid.Col>
        <Grid.Col xs={3}>{child}</Grid.Col>
        <Grid.Col xs={6}>{child}</Grid.Col> */}
      </Grid>
    </Container>
  );
};
