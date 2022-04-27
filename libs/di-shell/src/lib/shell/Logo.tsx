import { createStyles, Group, Text, ThemeIcon, Title } from '@mantine/core';
import { Photo } from 'tabler-icons-react';
const useStyles = createStyles((theme) => ({}));

export const AppLogo: React.FC = () => {
  const { classes, cx } = useStyles();
  return (
    <Group>

<Title color="white" order={3}><Text color="blue" inherit component="span">B</Text>oards</Title>
      <Text>Boards</Text>
    </Group>
  );
};
