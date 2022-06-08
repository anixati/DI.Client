import { useAppContext } from '@dotars/di-core';
import { createStyles, Group, Text, Title, UnstyledButton } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
const useStyles = createStyles((theme) => ({
  logo: {
    color: 'white',
  },
  version: {
    marginTop: 8,
    color: 'grey',
  },
}));

export const AppLogo: React.FC = () => {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
  const {setNavRoot} = useAppContext();
  const onClickLink = (route: string) => {
      if(setNavRoot)setNavRoot(route);
      navigate(route);
  };
  return (
    <Group>
      <UnstyledButton  onClick={()=> onClickLink('/')}>
        <Title className={classes.logo} order={3}>
          <Text color="blue" inherit component="span">
            B
          </Text>
          oards
        </Title>{' '}
        </UnstyledButton>
      <Text className={classes.version} size="sm">
        v1.0
      </Text>
    </Group>
  );
};
