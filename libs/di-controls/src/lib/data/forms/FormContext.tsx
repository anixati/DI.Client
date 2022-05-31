import { createContext } from "react";


export type ResultState = 'INIT' | 'ERROR' | 'SUBMITTING' | 'SUCCESS';
export type PageState = 'INIT' | 'ERROR' | 'CURRENT' | 'SUCCESS';
export type PageInfo = {
  id: string;
  title?: string;
  desc?: string;
  state: PageState;
};

export interface IWizardContext {
  processState: ResultState;
  current?: PageInfo;
  pages: Array<PageInfo>;
  page: number;
  values: Record<string, any>;
  errors: Record<string, any>;
  setPage?: (page: number) => void;
  canGoNext: () => boolean;
  closeModal?: () => void;
  submit?: () => void;
}
export const WizardContext = createContext<IWizardContext>({
  processState: 'INIT',
  pages: [],
  page: 0,
  values: {},
  errors: {},
  canGoNext: () => {
    return true;
  },
});