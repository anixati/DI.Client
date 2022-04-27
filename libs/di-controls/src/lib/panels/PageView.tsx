import { Avatar, Card, Container, createStyles, Group, Header, Paper, Text } from '@mantine/core';
import { ReportAnalytics } from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },

  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
  },

  header: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  avatar:{
    color:'#071E3E'
  },
  content: {
    minHeight: 380,
  },
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },
}));

export interface PageViewProps {
  title: string;
  desc?: string;
}

export const PageView: React.FC<PageViewProps> = (rx) => {
  const { classes } = useStyles();
  return (
    <Card withBorder p="lg" className={classes.card}>
      <Card.Section className={classes.header}>
        <Group spacing="sm">
          <Avatar color="#071E3E" radius="sm" size={45}>
            <ReportAnalytics size={45} />
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
      <div className={classes.content}>{rx.children}</div>
      <Card.Section className={classes.footer}>Ak</Card.Section>
    </Card>
  );
};
