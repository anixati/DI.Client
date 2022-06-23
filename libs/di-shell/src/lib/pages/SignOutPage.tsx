import { TitledPanel } from '@dotars/di-controls';
import { Button, createStyles } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const useStyles = createStyles((theme) => ({
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

export const SignOutPage: React.FC = () => {
  const navigate = useNavigate();
  const { classes } = useStyles();
  return (
    <TitledPanel title="Signed out" desc="You have been logged out">
      <Button
        fullWidth
        style={{ marginTop: 14 }}
        variant="gradient"
        gradient={{ from: 'indigo', to: 'cyan' }}
        onClick={() => navigate('/')}
      >
        Login Again
      </Button>
    </TitledPanel>
  );
};
