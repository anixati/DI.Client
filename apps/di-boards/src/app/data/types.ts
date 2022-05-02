import { ICodeRecord } from '@dotars/di-core';

export interface OptionKey extends ICodeRecord {}

export interface OptionValue extends ICodeRecord {
  description: string;
  label: string;
  optionId: number;
  order: number;
  value: number;
}
