import { createContext, useContext } from "react";
import { NavLink } from "../site";
import { AppSettings } from "./AppSettings";


export interface IAppContext {
    loading: boolean;
    theme: string;
    settings?: AppSettings;
    changeTheme?: (name: string) => void;
    showLoading?: (show: boolean) => void;
    showError?: (error: string) => void;
    notify?: (msg: string) => void;
    navRoot: string;
    setNavRoot?: (route: string) => void;
    crtRoute: string;
    setRoute?: (route: string) => void;
    sideNav?:NavLink;
}


export const defaultAppState: IAppContext = {
    loading: false,
    theme: "default",
    navRoot:"/",
    crtRoute:"/"
};

export const AppContext = createContext<IAppContext>(defaultAppState);

export const useAppContext = () => useContext(AppContext);
