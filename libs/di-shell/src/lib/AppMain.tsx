import { Global, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AuthRouter } from './AuthRouter';
import { myTheme } from './Theme';


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
          <NotificationsProvider position="bottom-right" zIndex={8077}>
            <AuthRouter>{rx.children}</AuthRouter>
          </NotificationsProvider>
        </ModalsProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};
