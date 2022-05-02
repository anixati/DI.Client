import { createStyles } from '@mantine/core';

export const appStyles = createStyles((theme) => ({
  box: {
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    margin: 5,
  },
  grid: {
    margin: 2,
  },
  firstGrid: {
    borderRight: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
  },
}));
