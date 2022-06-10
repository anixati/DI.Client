import { AppProvider } from '@dotars/di-core';
import { AppRoutes } from './app/appRoutes';

export function App() {
  const appSettings = {
    baseApiurl: 'https://localhost:44320/brds/v1',
    oidc_authority: 'http://localhost:6964',
    clientBase: 'http://localhost:4200',
    oidc_clientId: 'dotars_boards',
    oidc_responseType: 'id_token token',
    oidc_scope: 'openid profile boardsapi',
  };

  return (
    <AppProvider settings={appSettings} title="Boards">
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
