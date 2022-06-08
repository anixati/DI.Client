import { IEntity } from '@dotars/di-core';
import { createContext, useContext, useState } from 'react';

export type ResultState = 'INIT' | 'ERROR' | 'SUBMITTING' | 'SUCCESS';
export type PageState = 'INIT' | 'ERROR' | 'CURRENT' | 'SUCCESS';
export type PageInfo = {
  id: string;
  title?: string;
  desc?: string;
  state: PageState;
};

export interface IWizFormContext {
  modalId: string;
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

export const WizardFormContext = createContext<IWizFormContext>({
  modalId: '',
  processState: 'INIT',
  pages: [],
  page: 0,
  values: {},
  errors: {},
  canGoNext: () => {
    return true;
  },
});

export interface IMdlContext {
  modalId: string;
}
export const MdlContext = createContext<IMdlContext>({ modalId: '' });
