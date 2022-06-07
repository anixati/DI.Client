import { currentNav, NavLink, rootNav, showNavigation, SiteUi } from '@dotars/di-core';
import { Box, ChevronIcon, Collapse, Group, Navbar, ScrollArea, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileAnalytics } from 'tabler-icons-react';
import { shellStyles } from './ShellStyles';

export function SideNavGroup(item: NavLink) {
  const { classes, theme, cx } = shellStyles();
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
          className={cx(classes.navbar_link, { [classes.navbar_linkActive]: current === item.route })}
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
        className={cx(classes.navbar_control, { [classes.navbar_controlActive]: current === item.route })}
      >
        <Group position="apart" spacing={0}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon
              variant="light"
              size={30}
              sx={(theme) => ({
                color: theme.colors['dotars'][0],
                backgroundColor: theme.colors.gray[1],
                '&:hover': {
                  backgroundColor: theme.colors.gray[1],
                },
              })}
            >
              <FileAnalytics size={18} />
            </ThemeIcon>
            <Box ml="md">{item.label}</Box>
          </Box>
          {hasLinks && <ChevronIcon className={classes.navbar_chevron} style={{ transform: opened ? `rotate(${theme.dir === 'rtl' ? -90 : 90}deg)` : 'none' }} />}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{navItems}</Collapse> : null}
    </>
  );
}

export function NavbarNested() {
  const { classes } = shellStyles();
  const [root] = useAtom(rootNav);
  const [nav] = useAtom(showNavigation);
  const [opened] = useState(false);

  const sideNav = SiteUi.Ctx?.navigation && SiteUi.Ctx?.navigation.filter((x) => x.route === root)[0];

  const items = sideNav?.links && sideNav.links.map((x) => <SideNavGroup {...x} key={x.label} />);
  return (
    <div>
      {nav && (
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 200 }} className={classes.navbar}>
          <Navbar.Section grow className={classes.navbar_links} component={ScrollArea}>
            <div className={classes.navbar_linksInner}>{items}</div>
          </Navbar.Section>
        </Navbar>
      )}
    </div>
  );
}
