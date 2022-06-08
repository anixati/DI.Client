import axios from 'axios';
import { useCallback, useState } from 'react';
import { NavLink, SiteUi } from '../site';
import { AppSettings } from './AppSettings';
import { AppContext, defaultAppState } from './IAppContext';

export const AppProvider: React.FC<AppSettings> = (rx) => {
  const [theme, setTheme] = useState(defaultAppState.theme);
  const [loading, setLoading] = useState(defaultAppState.loading);
  const [settings, setSettings] = useState<AppSettings>({ ...rx });

  axios.defaults.baseURL = rx.baseApiurl;
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
  const [navRoot, setRoot] = useState<string>('/');
  const setNavRoot = useCallback((route: string) => {
    setRoot(route);
    if (SiteUi.Ctx?.navigation) {
      const snv = SiteUi.Ctx?.navigation.filter((x) => x.route === route);
      if (snv && snv.length > 0) setSideNav(snv[0]);
      else setSideNav(undefined);
    }
  }, []);
  const [crtRoute, setCrtRoute] = useState<string>('/');
  const setRoute = useCallback((route: string) => {
    setCrtRoute(route);
  }, []);
  const [sideNav, setSideNav] = useState<NavLink | undefined>(undefined);


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
        crtRoute,
        setRoute,
        sideNav,
      }}
    >
      {rx.children}
    </AppContext.Provider>
  );
};
