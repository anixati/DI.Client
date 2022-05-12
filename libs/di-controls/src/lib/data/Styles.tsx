import { createStyles } from '@mantine/core';

export const dataUiStyles = createStyles((theme) => ({
  listView: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height: '83vh',
  },
  entityView: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    height:  '83vh',
  },
  card: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    
  },
  header: {
    padding: theme.spacing.xs,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  footer: {
    padding: 3,//theme.spacing.xs,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  content: {
    paddingBottom: 10,
    paddingTop: 10,
    paddinLeft: 5,
    paddinRight: 5,
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
}));
