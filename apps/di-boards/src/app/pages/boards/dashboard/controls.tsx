import { ShowError } from '@dotars/di-controls';
import { getErrorMsg, IDataResponse, setBearerToken } from '@dotars/di-core';
import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import axios from 'axios';
import { useDashStyles } from './styles';

export interface IDbDataItem {
  title: string;
  description: string;
  value?: string;
  result?: string;
  resultColor?: string;
  icon?: string;
}
export interface IDbData {
  data: Array<IDbDataItem>;
}
export const getDashboardData = async (dbId: number) => {
  try {
    setBearerToken();
    console.log('set token');
    const rsp = await axios.get<IDataResponse<IDbData>>(`/dashboard/${dbId}`);
    if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
    if (rsp.data?.result?.data) return rsp.data.result.data;
  } catch (ex) {
    ShowError('Table schema error', `Details:${getErrorMsg(ex)}`);
  }
  return undefined;
};

export interface RenderStatsGridProps {
  items: Array<IDbDataItem>;
}

export const RenderStatsGrid: React.FC<RenderStatsGridProps> = (rx) => {
  const { classes } = useDashStyles();
  const Stats = () => (
    <>
      {rx.items.map((stat) => {
        return (
          <Paper withBorder p="md" radius="md" key={stat.title}>
            <Group position="apart">
              <Text size="xs" color="dimmed" className={classes.title}>
                {stat.title}
              </Text>
              {/* <Icon className={classes.icon} size={22} /> */}
            </Group>
            <Group align="flex-end" spacing="xs" mt={25}>
              <Text className={classes.value}>{stat.value}</Text>
              <Text color={stat.resultColor ? stat.resultColor : 'teal'} size="sm" weight={500} className={classes.diff}>
                <span>{stat.result}</span>
              </Text>
            </Group>

            <Text size="xs" color="dimmed" mt={7}>
              {stat.description}
            </Text>
          </Paper>
        );
      })}
    </>
  );
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        <Stats />
      </SimpleGrid>
    </div>
  );
};
