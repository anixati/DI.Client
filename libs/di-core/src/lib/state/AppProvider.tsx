import { useLocalStorage } from '@mantine/hooks';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { NavLink } from '../data';
import { AppSettings } from './AppSettings';
import { AppContext, defaultAppState } from './IAppContext';

export interface AppProviderProps {
  title: string;
  settings: AppSettings;
}

export const AppProvider: React.FC<AppProviderProps> = (rx) => {
  const [theme, setTheme] = useState(defaultAppState.theme);
  const [loading, setLoading] = useState(defaultAppState.loading);
  const [settings] = useState<AppSettings>({ ...rx.settings });
  const [sideNav, setSideNav] = useState<NavLink | undefined>(undefined);
console.log('----',rx.settings)
  axios.defaults.baseURL = rx.settings.baseApiurl;
  const changeTheme = (name: string) => {
    setTheme(name);
  };
  const showLoading = (show: boolean) => {
    setLoading(show);
  };
  const showError = (error: string) => {
    console.log(error);
  };
  const notify = (msg: string) => {
    console.log(msg);
  };

  const [sitemap, setSiteMap] = useLocalStorage<NavLink[]>({
    key: 'site-map',
    defaultValue: [],
  });

  const setSiteData = (sitemap: NavLink[]): void => {
    setSiteMap(sitemap);
  };

  const [navRoot, setRoot] = useState<string>('/');
  const setNavRoot = (route: string) => {
    setRoot(route);
    if (sitemap.length > 0) {
      const snv = sitemap.filter((x) => x.route === route);
      if (snv && snv.length > 0) setSideNav(snv[0]);
      else setSideNav(undefined);
    }
  };

  const [route, setCrntRoute] = useState<string>('/');
  const setRoute = useCallback((route: string) => {
    setCrntRoute(route);
  }, []);

  const logout = () => {
    console.log('logging out ');
    setSiteMap([]);
  };

  const [navClose, setNavClose] = useState<boolean>(false);
  const showNav = (flag: boolean) => {
    setNavClose(flag); 
  };
  return (
    <AppContext.Provider
      value={{
        loading,
        theme,
        settings,
        changeTheme,
        showLoading,
        showError,
        notify,
        navRoot,
        setNavRoot,
        route,
        setRoute,
        sitemap,
        sideNav,
        logout,
        setSiteData,
        navClose,
        showNav
      }}
    >
      {rx.children}
    </AppContext.Provider>
  );
};
