import { AppProvider } from '@dotars/di-core';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppRoutes } from './app/appRoutes';
import { env } from './env';
export function App() {
  // const appSettings = {
  //   baseApiurl: 'https://localhost:44320/brds/v1',
  //   oidc_authority: 'http://localhost:6964',
  //   clientBase: 'http://localhost:4200',
  //   oidc_clientId: 'dotars_boards',
  //   oidc_responseType: 'id_token token',
  //   oidc_scope: 'openid profile boardsapi',
  // };

  const appSettings = {
    baseApiurl: `${env.apiBase}`,
    oidc_authority: `${env.idcAuth}`,
    clientBase: `${env.appBase}`,
    oidc_clientId: `${env.appId}`,
    oidc_responseType: 'id_token token',
    oidc_scope: 'openid profile boardsapi',
  };
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider settings={appSettings} title="Boards">
        <AppRoutes />
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
