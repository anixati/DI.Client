import { NavLink, useAppContext } from '@dotars/di-core';
import { Avatar, createStyles, Divider, Group, Header, Menu, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Logout, Settings, SwitchHorizontal } from 'tabler-icons-react';
import { AppLogo } from './Logo';

const headerStyles = createStyles((theme) => ({
  header: {
    paddingTop: 5,
    paddingBottom: 0,
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    backgroundColor: '#071E3E', //theme.colors[theme.primaryColor][9],
  },
  links: {},

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: 1,
    textDecoration: 'none',
    color: theme.colors['gray'][0],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,
    '&:hover': {
      backgroundColor: 'white',
      color: 'black',
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: 'white',
      color: '#071E3E',
    },
  },

  userActive: {
    backgroundColor: theme.colors['gray'][0],
  },
  userMenu: {},
  user: {
    color: theme.colors['gray'][5],
    padding: 5,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',
    '&:hover': {
      backgroundColor: theme.colors['gray'][5],
    },
  },
}));
export interface HeaderNavProps {
  userName?: string;
  OnLogout: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = (rx) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = headerStyles();
  const location = useLocation();
  const { sitemap, setNavRoot, logout } = useAppContext();
  const navigate = useNavigate();
  const onClickLink = (route?: string) => {
    if (setNavRoot && route) {
      navigate(route);
    }
  };
  const isCurrent = (link: NavLink): boolean => {
    if (link.route && location.pathname.startsWith(link.route)) {
      return true;
    }
    return false;
  };

  const mainMenu =
    sitemap &&
    sitemap.map(
      (link) =>
        link?.route && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            key={link.label}
            className={cx(classes.link, { [classes.linkActive]: isCurrent(link) })}
            onClick={(e) => {
              e.preventDefault();
              onClickLink(link.route);
            }}
          >
            {link.label}
          </a>
        )
    );

  return (
    <Header height={40} className={classes.header}>
      <Group position="apart">
        <Group position="left">
          <AppLogo />
        </Group>

        <Group position="right">
          <Group position="left">{mainMenu}</Group>
          <Group position="right">
            <Menu
              size={260}
              placement="end"
              className={classes.userMenu}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withArrow
              control={
                <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                  <Avatar radius="xl" size={20} />
                </UnstyledButton>
              }
            >
              <Menu.Label> {rx.userName}</Menu.Label>
              <Divider />
              {/* <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
              <Menu.Item icon={<SwitchHorizontal size={14} />}>My Profile</Menu.Item> */}
              <Divider />
              <Menu.Item
                color="red"
                icon={<Logout size={14} />}
                onClick={() => {
                  rx.OnLogout();
                }}
              >
                Logout
              </Menu.Item>
            </Menu>
          </Group>
        </Group>
      </Group>
    </Header>
  );
};
