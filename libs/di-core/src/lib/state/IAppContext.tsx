import { createContext, useContext } from "react";
import { NavLink } from "../data";
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
    route: string;
    setRoute?: (route: string) => void;
    sitemap?:NavLink[];
    sideNav?:NavLink;
    logout?: () => void;
    setSiteData?: (sitemap: NavLink[]) => void;
}


export const defaultAppState: IAppContext = {
    loading: false,
    theme: "default",
    navRoot:"/",
    route:"/"
};

export const AppContext = createContext<IAppContext>(defaultAppState);

export const useAppContext = () => useContext(AppContext);
