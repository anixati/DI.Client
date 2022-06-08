import { SecurityCtx, useAppContext } from '@dotars/di-core';
import { AppShell, useMantineTheme } from '@mantine/core';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { HeaderNav } from './HeaderNav';
import { NavbarNested } from './SideNav';

export const ShellPage: React.FC<SecurityCtx> = (rx) => {
  const theme = useMantineTheme();
  const { sideNav, setNavRoot } = useAppContext();

  const location = useLocation();
  useEffect(() => {
    const xp = location.pathname;
    const ix = xp.indexOf('/', 1);
    const rx = ix > 0 ? xp.substring(0, xp.indexOf('/', 1)) : xp;
    console.log(rx, '@@@@');
    if (setNavRoot) setNavRoot(rx);
  }, [location, setNavRoot]);

  return (
    <AppShell
      styles={{
        main: {
          backgroundColor: theme.colors.gray[1],
        },
      }}
      padding={8}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={sideNav && <NavbarNested />}
      header={<HeaderNav manager={rx.manager} />}
    >
      <Outlet />
    </AppShell>
  );
};
