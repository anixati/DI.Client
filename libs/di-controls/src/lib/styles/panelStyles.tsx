import { createStyles } from '@mantine/core';



export const panelStyles = createStyles((theme) => ({
  Card: {
    display: 'flex',
    flexDirection: 'column',
    //height: '94vh',
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },
  Header: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    flexBasis: '50px',
  },
  Content: {
    background: 'white',
    flexGrow: '1',
    padding: 8
  },
  Footer: {
    flexBasis: '50px',
  },
  vwbutton: {
    borderRadius: 0,

    '&:not(:first-of-type)': {
      borderLeftWidth: 0,
    },

    '&:first-of-type': {
      borderTopLeftRadius: theme.radius.sm,
      borderBottomLeftRadius: theme.radius.sm,
    },

    '&:last-of-type': {
      borderTopRightRadius: theme.radius.sm,
      borderBottomRightRadius: theme.radius.sm,
    },
  },
}));
