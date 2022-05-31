import { createStyles } from '@mantine/core';

export const dataUiStyles = createStyles((theme) => ({
  listView: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '83vh',
  },
  entityView: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '83vh',
  },
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
  },
  cardHeader: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  cardFooter: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
    padding: 3, //theme.spacing.xs,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },

  cardContent: {
    // paddingBottom: 10,
    // paddingTop: 10,
    // paddingLeft: 5,
    // paddingRight: 5,
    //   minHeight:'55vh',
    // backgroundColor:'red'
  },
  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
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
  tableicon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
  rowSelected: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2) : theme.colors[theme.primaryColor][0],
  },
  tableCell: { padding: 5 },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
  linkbox: { width: 330 },
  box: {
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
    height: '90vh',
  },
  form: {
    padding: 8,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]}`,
  },
  //paged table
  ptCard: {
    display: 'flex',
    flexDirection: 'column',
    height: '88vh',
  },
  ptheader: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    flexBasis: '50px',
  },
  ptContent: {
    background: 'white',
    flexGrow: '1',
    paddingLeft: 4,
    paddingRight: 4,
  },
  ptFooter: {
   // borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    padding: 5,
    background: theme.colors.gray[1],
    // flexBasis: '50px',
    Height: 70,
  },
  toolButton: {
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
