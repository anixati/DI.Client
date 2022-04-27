import { currentNav, NavLink, rootNav, showNavigation, SiteUi } from '@dotars/di-core';
import { Box, ChevronIcon, Collapse, createStyles, Group, Navbar, ScrollArea, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileAnalytics } from 'tabler-icons-react';

export const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    paddingBottom: 0,
  },
  header: {
    padding: theme.spacing.md,
    paddingTop: 0,
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },

  links: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
  },

  linksInner: {
    paddingTop: theme.spacing.xs,
    paddingBottom: theme.spacing.xl,
  },

  footer: {
    marginLeft: -theme.spacing.md,
    marginRight: -theme.spacing.md,
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },

  control: {
    fontWeight: 500,
    display: 'block',
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    fontSize: theme.fontSizes.sm,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  link: {
    fontWeight: 500,
    display: 'block',
    textDecoration: 'none',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    paddingLeft: 31,
    marginLeft: 30,
    fontSize: theme.fontSizes.sm,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    borderLeft: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },

  chevron: {
    transition: 'transform 200ms ease',
  },

  controlActive: {
    '&, &:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25) : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25) : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

export function SideNavGroup(item: NavLink) {
  const { classes, theme, cx } = useStyles();
  const [appRoot] = useAtom(rootNav);
  const [current, setCurrent] = useAtom(currentNav);
  const hasLinks = Array.isArray(item.links);
  const [opened, setOpened] = useState(true);
  const navigate = useNavigate();

  const gotoPath = (route?: string) => {
    if (route) {
      setCurrent(route);

      navigate(`${appRoot}${route}`);
    }
  };
  const navItems = (item.links ? item.links : []).map(
    (link) =>
      link.route && (
        <Text<'a'>
          component="a"
          className={cx(classes.link, { [classes.linkActive]: current === item.route })}
          key={link.label}
          onClick={(e) => {
            e.preventDefault();
            gotoPath(link.route);
          }}
        >
          {link.label}
        </Text>
      )
  );

  return (
    <>
      <UnstyledButton
        onClick={() => {
          setOpened((o) => !o);
          if (!hasLinks && item.route) {
            gotoPath(item.route);
          }
        }}
        className={cx(classes.control, { [classes.controlActive]: current === item.route })}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <FileAnalytics size={18} />
            </ThemeIcon>
            <Box ml="md">{item.label}</Box>
          </Box>
          {hasLinks && <ChevronIcon className={classes.chevron} style={{ transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none' }} />}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{navItems}</Collapse> : null}
    </>
  );
}

export function NavbarNested() {
  const { classes } = useStyles();
  const [appRoot] = useAtom(rootNav);
  const [nav, setNav] = useAtom(showNavigation);
  const [opened, setOpened] = useState(false);

  const sideNav = SiteUi.Ctx?.navigation && SiteUi.Ctx?.navigation.filter((x) => x.route === appRoot)[0];
  const items = sideNav?.links && sideNav.links.map((x) => <SideNavGroup {...x} key={x.label} />);
  return (
    <>
      {nav && (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 200 }} className={classes.navbar}>
          <Navbar.Section grow className={classes.links} component={ScrollArea}>
            <div className={classes.linksInner}>{items}</div>
          </Navbar.Section>
        </Navbar>
      )}
    </>
  );
}
