import { Card, createStyles, ScrollArea } from '@mantine/core';
import { useState } from 'react';

export interface ScrollPanelProps {
  rndrTitle?: () => React.ReactNode;
}


const useStyles = createStyles((theme) => ({
  header: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  scrollCard: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height:'85vh',
  },
  scrollContent:{
    paddingBottom: 10,
    paddingTop: 10,
    paddingLeft: 5,
    paddingRight: 5,
    height:'85vh',
  },
}));
export const ScrollPanel: React.FC<ScrollPanelProps> = (rx) => {
  const { classes } = useStyles();
  const [scrolled, setScrolled] = useState(false);
  return (
    <Card withBorder p="lg" className={classes.scrollCard}>
      <Card.Section className={classes.header}>{rx.rndrTitle && rx.rndrTitle()}</Card.Section>
      <Card.Section className={classes.scrollContent}>
        <ScrollArea sx={{ minHeight: 250, paddingRight: 20 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
          {rx.children}
        </ScrollArea>
      </Card.Section>
    </Card>
  );
};
