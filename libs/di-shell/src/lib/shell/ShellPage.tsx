import { SecurityCtx, useAppContext } from '@dotars/di-core';
import { AppShell, useMantineTheme } from '@mantine/core';
import { User } from 'oidc-client';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderNav } from './HeaderNav';
import { NavbarNested } from './SideNav';

export const ShellPage: React.FC<SecurityCtx> = (rx) => {
  const theme = useMantineTheme();
  const [user, setUser] = useState<User | null>(null);
  const { rootNav, sideNav, setNavRoot, logout } = useAppContext();
  const location = useLocation();

  
  /* #region  EVENTS */

  const onLogout = useCallback(async () => {
    if (logout) logout();
    await rx.manager.clearStaleState();
    await rx.manager.revokeAccessToken();
    await rx.manager.removeUser();
    await rx.manager.signoutRedirect();
  }, [rx.manager, logout]);

  /* #endregion */
  /* #region  EFFECTS */
  useEffect(() => {
    async function getUser() {
      const user = await rx.manager?.getUser();
      setUser(user);
    }
    getUser();
  }, [rx]);

  useEffect(() => {
    //if (rootNav?.length === 0) onLogout();
    const xp = location.pathname;
    if (setNavRoot) setNavRoot(xp.indexOf('/', 1) > 0 ? xp.substring(0, xp.indexOf('/', 1)) : xp);
  }, [location, onLogout, rootNav?.length, setNavRoot]);

  /* #endregion */

  return (
    <AppShell
      styles={{
        main: {
          backgroundColor: theme.colors['gray'][1],
        },
      }}
      padding={8}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={sideNav && <NavbarNested />}
      header={<HeaderNav OnLogout={onLogout} userName={user?.profile?.name} />}
    >
      <Outlet />
    </AppShell>
  );
};
