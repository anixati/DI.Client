import { useState } from 'react';
import { defaultAppState, AppContext } from './IAppContext';
import { AppSettings } from "./AppSettings";

export const AppProvider: React.FC<AppSettings> = (rx) => {
  const [theme, setTheme] = useState(defaultAppState.theme);
  const [loading, setLoading] = useState(defaultAppState.loading);
  const [settings, setSettings] = useState<AppSettings>({...rx});
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
      }}
    >
      {rx.children}
    </AppContext.Provider>
  );
};
