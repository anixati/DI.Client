import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter } from 'react-router-dom';
import { AuthRouter } from './routes/AuthRouter';

const myTheme: MantineThemeOverride = {
  colorScheme: 'light',
  colors: {
    //blue: ['#4EB2B4','#071E3E', '#4EB2B4'],
  },
  primaryColor: 'blue',
  defaultRadius: 3,
};



export const AppMain: React.FC = (rx) => {


  
  return (
    <MantineProvider theme={myTheme} withGlobalStyles withNormalizeCSS>
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
