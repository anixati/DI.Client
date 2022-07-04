const { API_BASE, IDC_AUTH, APP_BASE, APP_ID } = (window as any).__env__;

type Environment = {
  apiBase: string;
  idcAuth: string;
  appBase: string;
  appId: string;
};
export const env: Environment = {
  apiBase: API_BASE,
  idcAuth: IDC_AUTH,
  appBase: APP_BASE,
  appId: APP_ID,
};
