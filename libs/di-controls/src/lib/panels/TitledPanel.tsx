import {
  createStyles,
  Paper,
  Title,
  Text,
  Container,
  Center,
} from '@mantine/core';
import { CenterPanel } from './CenterPanel';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom:20,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}));

export interface TitledPanelProps {
  title: string;
  desc: string;
}

export const TitledPanel: React.FC<TitledPanelProps> = (rx) => {
  const { classes } = useStyles();
  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        {rx.title}
      </Title>
      <CenterPanel title={rx.desc} desc=""     >
        {rx.children}
      </CenterPanel>
    </Container>
  );
};
