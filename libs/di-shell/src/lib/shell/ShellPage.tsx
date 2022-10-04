import { SecurityCtx, useAppContext } from '@dotars/di-core';
import { AppShell, useMantineTheme } from '@mantine/core';
import { User } from 'oidc-client';
import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { HeaderNav } from './HeaderNav';
import { NavbarNested } from './SideNav';

export const ShellPage: React.FC<SecurityCtx> = (rx) => {
  const theme = useMantineTheme();
  const [user, setUser] = useState<User | null>(null);
  const { sitemap, sideNav, setNavRoot, logout } = useAppContext();
  const location = useLocation();

  /* #region  EVENTS */

  const onLogout = useCallback(async () => {
  
    const user = await rx.manager?.getUser();
    //await rx.manager.clearStaleState();
   // await rx.manager.revokeAccessToken();
    
    console.log('signout redirecting....')
     rx.manager.signoutRedirect({ 'id_token_hint': user?.id_token})
     .then(()=>{
       console.log('signout redirecting.... done')
       if (logout) logout();
     });
    //await rx.manager.removeUser();
   
  }, [rx.manager, logout]);

  /* #endregion */

  const navigate = useNavigate();
  /* #region  EFFECTS */

  
  useEffect(() => {
    async function getUser() {
      const user = await rx.manager?.getUser();
     // console.log(user,'--',user?.profile['rst']);
      if (user?.profile && user.profile['rst'] === '1') {
        navigate('/denied');
      }
      setUser(user);
    }
    getUser();
  }, [rx]);

  useEffect(() => {
    //if (rootNav?.length === 0) onLogout();
    const xp = location.pathname;
    if (setNavRoot) setNavRoot(xp.indexOf('/', 1) > 0 ? xp.substring(0, xp.indexOf('/', 1)) : xp);
  }, [location, onLogout, sitemap?.length, setNavRoot]);

  /* #endregion */

  return (
    <AppShell
      styles={{
        main: {
         // backgroundColor: theme.colors['gray'][1],
        },
      }}
      padding={0}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<NavbarNested />}
      header={<HeaderNav OnLogout={onLogout} userName={user?.profile?.nickname} />}
    >
      <Outlet />
    </AppShell>
  );
};
