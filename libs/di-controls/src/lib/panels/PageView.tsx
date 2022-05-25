import { EntityCtxProvider } from '@dotars/di-core';
import { Avatar, Box, Card, createStyles, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const useStyles = createStyles((theme) => ({
  Card: {
    display: 'flex',
    flexDirection: 'column',
    //height: '94vh',
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },
  Header: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    flexBasis: '50px',
  },
  Content: {
    background: 'white',
    flexGrow: '1',
    padding: 8,
  },
  Footer: {
    flexBasis: '50px',
  },
}));

export interface IPageViewProps {
  title: string;
  icon?: ReactNode;
  desc: string;
  renderCmds?: () => ReactNode;
}
export const PageView: React.FC<IPageViewProps> = (rx) => {
  const { classes } = useStyles();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <EntityCtxProvider>
        <Card withBorder className={classes.Card}>
          <Card.Section className={classes.Header}>
            <Box>
              <Group spacing="sm" position="apart">
                <Group spacing="sm" position="left">
                  <Avatar
                    styles={{
                      root: { color: '#071E3E' },
                      image: { color: '#071E3E' },
                      placeholder: { color: '#071E3E' },
                      placeholderIcon: { color: '#071E3E' },
                    }}
                    radius="sm"
                    size={45}
                  >
                    {rx.icon}
                  </Avatar>
                  <div>
                    <Text size="sm" color="dotars" weight={500}>
                      {rx.title}
                    </Text>
                    <Text color="dimmed" size="xs">
                      {rx.desc}
                    </Text>
                  </div>
                </Group>
                <Group position="right" spacing={3}>
                  {rx.renderCmds && rx.renderCmds()}
                </Group>
              </Group>
            </Box>
          </Card.Section>
          <Card.Section className={classes.Content}>{rx.children}</Card.Section>
        </Card>
      </EntityCtxProvider>
    </QueryClientProvider>
  );
};
