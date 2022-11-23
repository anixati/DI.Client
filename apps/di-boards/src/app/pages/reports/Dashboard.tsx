import { PageView } from '@dotars/di-controls';
import { getErrorMsg, IDataResponse, useAppContext } from '@dotars/di-core';
import { Alert, Avatar, Card, createStyles, Group, LoadingOverlay, SimpleGrid, Text, UnstyledButton, useMantineTheme } from '@mantine/core';
import axios from 'axios';
import { ShowError } from 'libs/di-controls/src/lib/controls';
import { useCallback, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { FileReport, Receipt } from 'tabler-icons-react';

// ---- table schema
export interface IReportConfig {
  reports: Array<IReportDef>;
}
export interface IReportDef {
  id: number;
  title: string;
  description: string;
  url: string;
  options?: string;
}

//-- styles

const rptDashStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colors['gray'][1],
    height:'90vh'
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: theme.radius.xs,
    padding: 8,
    backgroundColor: theme.white,
    transition: 'box-shadow 150ms ease, transform 100ms ease',

    '&:hover': {
      boxShadow: `${theme.shadows.md} !important`,
      transform: 'scale(1.05)',
    },
  },
}));

const getReportList = async () => {
  try {
    const resp = await axios.get<IDataResponse<IReportConfig>>(`/reports`);
    if (resp.data?.result?.reports) {
      const rs = resp.data?.result.reports;
      return rs;
    } else throw new Error(`Failed to retrive `);
  } catch (ex) {
    ShowError('API error', `failed to get report list :${getErrorMsg(ex)}`);
  }
  return undefined;
};

export const ReportDashboard: React.FC = () => {
  const { classes } = rptDashStyles();
  const theme = useMantineTheme();
  const { showNav } = useAppContext();
  useEffect(() => {
    if (showNav) showNav(false);
  }, [showNav]);
  const { isLoading, error, data, refetch, isSuccess } = useQuery('reports', async () => await getReportList(), { keepPreviousData: false, staleTime: 0 });
  
  
  const navigate = useNavigate();
  const handleClick = useCallback((item: IReportDef) => {
    navigate(`/reports/view/${item.id}`,{state:{item}});

  }, []);
  
  
  const items = (data: IReportDef[]) => {
    return (
      <>
        {data.map((item) => (
          <UnstyledButton key={item.id} className={classes.item} onClick={() => handleClick(item)}>
            <Group>
              <Avatar color="blue" radius="sm" mt={4}>
                <FileReport size={24} />
              </Avatar>
              <div style={{ flex: 1 }}>
                <Text size="sm" mt={1}>
                  {item.title}
                </Text>
                <Text size="xs" mt={2} color="dimmed">
                  {item.description}
                </Text>
              </div>
            </Group>
          </UnstyledButton>
        ))}
      </>
    );
  };

  return (
    <PageView title="Reports Dashboard" desc="" icon={<Receipt />} hideNavbtn={true}>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && data && (
        <Card withBorder radius="xs" className={classes.card}>
          <SimpleGrid cols={3} mt="md">
            {items(data)}
          </SimpleGrid>
        </Card>
      )}
    </PageView>
  );
};
