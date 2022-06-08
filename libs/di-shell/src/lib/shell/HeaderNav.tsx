import { NavLink, SecurityCtx, SiteUi, useAppContext } from '@dotars/di-core';
import { Avatar, Divider, Group, Header, Menu, Text, UnstyledButton } from '@mantine/core';
import { User } from 'oidc-client';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Logout, Settings, SwitchHorizontal } from 'tabler-icons-react';
import { AppLogo } from './Logo';
import { shellStyles } from './ShellStyles';



export const HeaderNav: React.FC<SecurityCtx> = (rx) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = shellStyles();
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const {setNavRoot} = useAppContext();
  useEffect(() => {
    async function getUser() {
      const user = await rx.manager?.getUser();
      setUser(user);
    }
    getUser();
  }, [rx]);

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
    SiteUi.Ctx?.navigation &&
    SiteUi.Ctx?.navigation.map(
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

  const onLogout = useCallback(async () => {
    await rx.manager.clearStaleState();
    await rx.manager.revokeAccessToken();
    await rx.manager.removeUser();
    await rx.manager.signoutRedirect();
  }, [rx.manager]);

  return (
    <Header height={56} className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <AppLogo />
        </Group>
        <Group>
          <Group ml={50} spacing={5} className={classes.links}>
            {mainMenu}
          </Group>
          <Menu
            size={260}
            placement="end"
            className={classes.userMenu}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            control={
              <UnstyledButton className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                <Group spacing={7}>
                  <Avatar radius="xl" size={20} />
                  <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                    {user?.profile?.name}
                  </Text>
                  <ChevronDown size={12} />
                </Group>
              </UnstyledButton>
            }
          >
            <Menu.Label>Settings</Menu.Label>
            <Menu.Item icon={<Settings size={14} />}>Settings</Menu.Item>
            <Menu.Item icon={<SwitchHorizontal size={14} />}>My Profile</Menu.Item>
            <Divider />
            <Menu.Item
              color="red"
              icon={<Logout size={14} />}
              onClick={() => {
                onLogout();
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </Group>
      </div>
    </Header>
  );
};
