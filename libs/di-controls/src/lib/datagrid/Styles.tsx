import { createStyles } from '@mantine/core';

export const dataGridStyles = createStyles((theme) => ({
  datagrid: {
    display: 'flex',
    flexDirection: 'column',
    height:'80vh',
    
  },
  dgHeader: {
    flex: '0 0 auto',
  //  background: `${theme.colors['gray'][1]}`,
    padding: '2px 15px',
    border:  `1px solid ${theme.colors['gray'][3]}`,
  },
  dgFooter: {
    flex: '0 0 auto',
   // background: `${theme.colors['gray'][1]}`,
    padding: '5px 15px',
    border: `1px solid ${theme.colors['gray'][3]}`,
  },
  dgContent: {
    flex: '1 1 auto',
    overflowY: 'scroll',
    borderLeft: `1px solid ${theme.colors['gray'][3]}`,
    borderRight: `1px solid ${theme.colors['gray'][3]}`,
  },

  ptCard: {
    // display: 'flex',
    // flexDirection: 'column',
    // // height: '100',
    // padding: 1,
  },
  ptheader: {
    padding: '5px 15px',
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    // flexBasis: '50px',
  },
  ptContent: {
    background: 'white',
    // flexGrow: '1',
    // paddingLeft: 4,
    // paddingRight: 4,
  },
  ptFooter: {
   
    Height: 70,
  },
  tableTh: {
    minWidth: 15,
  },
  tableheader: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
  tableicon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));
