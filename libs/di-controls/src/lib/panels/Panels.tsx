import { Card, Container, ScrollArea, Title } from '@mantine/core';
import { useState } from 'react';
import { CenterPanel } from './CenterPanel';
import { panelStyles } from './Styles';

export interface TitledPanelProps {
  title: string;
  desc: string;
}

export const TitledPanel: React.FC<TitledPanelProps> = (rx) => {
  const { classes } = panelStyles();
  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        {rx.title}
      </Title>
      <CenterPanel title={rx.desc} desc="">
        {rx.children}
      </CenterPanel>
    </Container>
  );
};




export interface ScrollPanelProps {
  rndrTitle?: () => React.ReactNode;
}
export const ScrollPanel: React.FC<ScrollPanelProps> = (rx) => {
  const { classes } = panelStyles();
  const [scrolled, setScrolled] = useState(false);
  return (
    <Card withBorder p="lg" className={classes.scrollCard}>
    <Card.Section className={classes.header}>
      {rx.rndrTitle && (rx.rndrTitle())}
    </Card.Section>
    <Card.Section className={classes.scrollContent}>
      <ScrollArea sx={{ minHeight: 250, paddingRight: 20 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
        {rx.children}
      </ScrollArea>
    </Card.Section>
  </Card>
  );
};
