import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AuthRouter } from './routes/AuthRouter';
export const AppMain: React.FC = (rx) => {
  return (
    <BrowserRouter>
      <ModalsProvider>
        <NotificationsProvider position="top-right" zIndex={2077}>
          <AuthRouter>{rx.children}</AuthRouter>
        </NotificationsProvider>
      </ModalsProvider>
    </BrowserRouter>
  );
};
