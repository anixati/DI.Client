import { Global, MantineProvider, MantineThemeOverride } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AuthRouter } from './routes/AuthRouter';

const myTheme: MantineThemeOverride = {
  colorScheme: 'light',
  colors: {
    'dotars': ['#071E3E', '#071E3E', '#071E3E', '#071E3E', '#071E3E', '#071E3E', '#071E3E', '#071E3E', '#071E3E', '#071E3E'],
  },
  primaryColor: 'blue',
  defaultRadius: 3,
};

export const AppMain: React.FC = (rx) => {
  return (
    <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
      <BrowserRouter>
        <ModalsProvider>
          <Global
            styles={(theme) => ({
              body: {
                height: '100%',
                backgroundColor: '#ccc',
                overflowX: 'hidden',
                overflowY: 'auto',
              },
            })}
          />
          <NotificationsProvider position="bottom-center" zIndex={8077}>
            <AuthRouter>{rx.children}</AuthRouter>
          </NotificationsProvider>
        </ModalsProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};
