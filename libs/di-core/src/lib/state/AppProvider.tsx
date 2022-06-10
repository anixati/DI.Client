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

  const [rootNav, setRootNav] = useLocalStorage<NavLink[]>({
    key: 'site-map',
    defaultValue: [],
  });

  const [navRoot, setRoot] = useState<string>('/');
  const setNavRoot = useCallback((route: string) => {
    setRoot(route);
    if (rootNav) {
      const snv = rootNav.filter((x) => x.route === route);
      if (snv && snv.length > 0) setSideNav(snv[0]);
      else setSideNav(undefined);
    }
  }, []);

  const [route, setCrntRoute] = useState<string>('/');
  const setRoute = useCallback((route: string) => {
    setCrntRoute(route);
  }, []);
  const [sideNav, setSideNav] = useState<NavLink | undefined>(undefined);

  const logout = () => {
    console.log('logging out ');
    setRootNav([]);
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
        rootNav,
        sideNav,
        logout,
      }}
    >
      {rx.children}
    </AppContext.Provider>
  );
};
