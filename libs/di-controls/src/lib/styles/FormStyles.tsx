import { createStyles } from '@mantine/core';


export const formStyles = createStyles((theme) => ({
  wzSummary: {
    // backgroundColor: '#FFFFF0',
    color: theme.colors['dotars'],
    padding: 15,
  },
  pgSelected: {
    backgroundColor: theme.colors['dotars'],
    color: '#fff',
  },
  navPanel: {
    minHeight: 280,
    padding: 0,
    backgroundColor: theme.colors.gray[1],
    boxShadow: theme.shadows.xs,
  },
  cntPanel: {
    minHeight: 280,
    padding: 5,
    border: `1px solid ${theme.colors.gray[1]}`,
    boxShadow: theme.shadows.xs,
  },
  wizard: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400,
  },
  wzheader: {
    padding: 5,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    flexBasis: '20px',
  },
  ptContent: {
    background: 'white',
    //flexGrow: '1',
    paddingLeft: 4,
    paddingRight: 4,
  },
  wzFooter: {
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    padding: 5,
    // flexBasis: '50px',
  },
  wzNavBar: {
    padding: 5,
    // flexBasis: '50px',
  },
  wzButton: {
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
