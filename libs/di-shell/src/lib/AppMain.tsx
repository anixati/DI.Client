import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AuthRouter } from './routes/AuthRouter';
export const AppMain: React.FC = (rx) => {
  return (
    <MantineProvider>
      <BrowserRouter>
        <ModalsProvider>
          <NotificationsProvider position="bottom-center" zIndex={8077}>
            <AuthRouter>{rx.children}</AuthRouter>
          </NotificationsProvider>
        </ModalsProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};
