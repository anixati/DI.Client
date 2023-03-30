import { createStyles } from '@mantine/core';



export const panelStyles = createStyles((theme) => ({
  Card: {
    display: 'flex',
    flexDirection: 'column',
    padding:'3px !important',
    //height: '94vh',
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
  },
  Header: {
    padding: '0px 10px',

    borderBottom: `1px solid  ${theme.colors['gray'][3]}`,
    flexBasis: '50px',
  },
  FormHeader: {
    padding: 10,

    borderBottom: `1px solid  ${theme.colors['gray'][3]}`,
    flexBasis: '50px',
  },
  TabPane:{  
    paddingLeft:3,
    paddingRight:3
  },
  Content: {
    background: 'white',
    padding: 4
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
