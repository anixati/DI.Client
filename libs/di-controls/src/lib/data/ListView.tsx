import { Card, createStyles, Group } from '@mantine/core';

const useStyles = createStyles((theme) => ({
 
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
      },
      header: {
        padding: theme.spacing.xs,
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
      },
      content: {
        minHeight: 380,
      },
}));

export interface ListViewProps {
  title: string;
  desc?: string;
}

export const ListView: React.FC<ListViewProps> = (rx) => {
  const { classes } = useStyles();
  return (
    <Card withBorder p="xs" >
      <Card.Section className={classes.header}>
        <Group spacing="sm">
          
        </Group>
      </Card.Section>
      <div className={classes.content}>
          
          {rx.children}
          
          </div>
      <Card.Section className={classes.footer}>

      </Card.Section>
    </Card>
  );
};
