import { createStyles } from '@mantine/core';


export const panelStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    marginBottom: 20,
  },

  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    
  },

  footer: {
    // display: 'flex',
    // justifyContent: 'space-between',
    padding: theme.spacing.xs,
    //padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
  },

  cardTitle: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
  },

}));
