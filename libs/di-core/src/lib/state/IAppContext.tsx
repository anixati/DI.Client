import { createContext, useContext } from "react";
import { AppSettings } from "./AppSettings";


export interface IAppContext {
    loading: boolean;
    theme: string;
    settings?: AppSettings;
    changeTheme?: (name: string) => void;
    showLoading?: (show: boolean) => void;
    showError?: (error: string) => void;
    notify?: (msg: string) => void;
}


export const defaultAppState: IAppContext = {
    loading: false,
    theme: "default"
};

export const AppContext = createContext<IAppContext>(defaultAppState);

export const useAppContext = () => useContext(AppContext);
