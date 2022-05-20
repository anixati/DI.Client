import { Container, Title } from '@mantine/core';
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
