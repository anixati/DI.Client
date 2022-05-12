import { createStyles, Group, Text, Title } from '@mantine/core';
import { version } from 'os';
const useStyles = createStyles((theme) => ({
  logo: {
    color: 'white',
  },
  version: {
    marginTop:8,
    color: 'grey',
  },
}));

export const AppLogo: React.FC = () => {
  const { classes, cx } = useStyles();
  return (
    <Group>
      <Title className={classes.logo} order={3}>
        <Text color="blue" inherit component="span">
          B
        </Text>
        oards
      </Title>
      <Text  className={classes.version} size="sm">v1.0</Text>
    </Group>
  );
};
