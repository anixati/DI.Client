import { IAuditedRecord } from '@dotars/di-core';


export interface OptionValue extends IAuditedRecord {
  description: string;
  label: string;
  optionId: number;
  order?: number;
  value: number;
}
