import { SecurityCtx } from '@dotars/di-core';
import { AppShell, useMantineTheme } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { HeaderNav } from './HeaderNav';
import { NavbarNested } from './SideNav';

export const ShellPage: React.FC<SecurityCtx> = (rx) => {
  const theme = useMantineTheme();
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
        },
      }}
      padding={8}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={<NavbarNested />}
      header={<HeaderNav manager={rx.manager} />}
    >
      <Outlet />
    </AppShell>
  );
};
