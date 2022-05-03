import { EntityCtxProvider, IViewProps } from '@dotars/di-core';
import { Avatar, Card, Container, createStyles, Group, LoadingOverlay, Text } from '@mantine/core';

 const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '93vh',
  },

  footer: {
    // display: 'flex',
    // justifyContent: 'space-between',
    padding: theme.spacing.xs,
    //padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
  },

  header: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  content: {
    paddingBottom: 10,
    paddingTop: 10,
    paddinLeft: 5,
    paddinRight: 5,
  },
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

export const PageView: React.FC<IViewProps> = (rx) => {
  const { classes } = useStyles();
  return (
    <EntityCtxProvider>
      <Card withBorder p="lg" className={classes.card}>
        <Card.Section className={classes.header}>
          <Group spacing="sm">
            <Avatar color="#071E3E" radius="sm" size={45}>
             {rx.icon}
            </Avatar>
            <div>
              <Text size="sm" weight={500}>
                {rx.title}
              </Text>
              <Text color="dimmed" size="xs">
                {rx.desc}
              </Text>
            </div>
          </Group>
        </Card.Section>
        <Card.Section className={classes.content}>
          <Container fluid={true}>{rx.children}</Container>
        </Card.Section>
        
        {/* <Card.Section className={classes.footer}>Ak</Card.Section> */}
      </Card>
    </EntityCtxProvider>
  );
};



