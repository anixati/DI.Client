import { createStyles } from '@mantine/core';

export const shellStyles = createStyles((theme) => ({
  header: {
    paddingTop:5,
    paddingBottom:0,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    backgroundColor: '#071E3E', //theme.colors[theme.primaryColor][9],
  },
  links: {
  },

  search: {
   
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: 0,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[0],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: 'cyan',
      color:'black'
    },
  },


  linkActive: {
    '&, &:hover': {
      backgroundColor: 'white',
      color:'#071E3E'
    },
  },

  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },
  navbar_header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },

  navbar_links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  navbar_linksInner: {
    paddingTop: 2,//theme.spacing.xs,
    paddingBottom: 2//theme.spacing.xs,
  },

  // navbar_footer: {
  //   marginLeft: -theme.spacing.md,
  //   marginRight: -theme.spacing.md,
  //   borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  // },

  navbar_control: {
    fontWeight: 400,
    display: 'block',
    width: '100%',
    padding: 6,// `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  navbar_link: {
    fontWeight: 400,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 20,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  navbar_chevron: {
    transition: 'transform 200ms ease',
  },

  navbar_controlActive: {
    '&, &:hover': {
      backgroundColor: '#071E3E',
      color:'white'
    },
  },

  navbar_linkActive: {
    '&, &:hover': {
      backgroundColor: '#071E3E',
      color:'white'
    },
  },

  footer: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[4]}`,
  },

  footer_inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  footer_links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));
