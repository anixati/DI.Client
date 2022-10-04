import { PageView } from '@dotars/di-controls';
import { getErrorMsg } from '@dotars/di-core';
import { ActionIcon, Grid, Group, Notification, Skeleton, Text } from '@mantine/core';
import { useQuery } from 'react-query';
import { AlertCircle, Receipt, Refresh } from 'tabler-icons-react';
import { getDashboardData, RenderStatsGrid } from './controls';

export const DashboardPage: React.FC = () => {
  const { isLoading, error, data, isSuccess, refetch } = useQuery('dashboard1', () => getDashboardData(100), { keepPreviousData: false });
  const refresh = () => {
    refetch();
  };
  if (isLoading) return <Skeleton height={140} radius="md" animate={false} />;
  if (error)
    return (
      <Notification title="Failed loading site data" disallowClose>
        <Group position="left">
          <AlertCircle size={32} color="red" />
          <Text color="red" size="lg">
            {getErrorMsg(error)}
          </Text>
        </Group>
      </Notification>
    );

  if (isSuccess && data) {
    return (
      <PageView
        title="Dashboard"
        desc=""
        icon={<Receipt />}
        renderCmds={() => (
          <ActionIcon
            size="lg"
            variant="hover"
            color="cyan"
            onClick={() => {
              refresh();
            }}
          >
            <Refresh />
          </ActionIcon>
        )}
      >
        <Grid grow>
          <Grid.Col xs={12}>
            <RenderStatsGrid items={data} />
          </Grid.Col>
        </Grid>
      </PageView>
    );
  }
  return <>.</>;
};
