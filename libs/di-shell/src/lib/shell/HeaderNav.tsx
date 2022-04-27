import { rootNav, SecurityCtx, SiteUi } from '@dotars/di-core';
import { Avatar, createStyles, Divider, Group, Header, Menu, UnstyledButton, Text } from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Logout, Settings, SwitchHorizontal, Trash } from 'tabler-icons-react';
import { AppLogo } from './Logo';
import { User } from 'oidc-client';

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    backgroundColor: '#071E3E', //theme.colors[theme.primaryColor][9],
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  links: {
    [theme.fn.smallerThan('md')]: {
      display: 'none',
    },
  },

  search: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[0],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[9],
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },
  userMenu: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[5],
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[5],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25) : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

export const HeaderNav: React.FC<SecurityCtx> = (rx) => {
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx } = useStyles();
  const [active, setActive] = useAtom(rootNav);
  const [user, setUser] = useState<User|null>(null);


  useEffect(() => {
    async function getUser() {
      const user = await rx.manager?.getUser();
      console.log(user);
      setUser(user);
    }

    getUser()
  }, [rx])


  const navigate = useNavigate();
  const onClickLink = (route?: string) => {
    if (route) {
      setActive(route);
      navigate(route);
    }
  };
  const mainMenu =
    SiteUi.Ctx?.navigation &&
    SiteUi.Ctx?.navigation.map(
      (link) =>
        link?.route && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            key={link.label}
            className={cx(classes.link, { [classes.linkActive]: active === link.route })}
            onClick={(e) => {
              e.preventDefault();
              setActive(link?.route);
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
          {/* <Burger opened={opened} onClick={() => toggleOpened()} size="sm" /> */}
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
            <Menu.Item color="red" icon={<Logout size={14} />} onClick={()=>{onLogout()}}>
              Logout
            </Menu.Item>
          </Menu>
        </Group>
      </div>
    </Header>
  );
};
