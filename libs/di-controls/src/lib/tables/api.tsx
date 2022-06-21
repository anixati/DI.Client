import { getErrorMsg, IDataResponse, IEntity, IGenericListResponse, ITableDef } from '@dotars/di-core';
import axios from 'axios';
import { ShowError } from '../controls';

export type SortInfo = {
  id: string;
  desc: boolean;
};

export const getTableSchema = async (schemaName: string) => {
  try {
    const rsp = await axios.get<IDataResponse<ITableDef>>(`/qry/schema/${schemaName}`);
    if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
    if (rsp.data?.result?.schema) return rsp.data.result.schema;
  } catch (ex) {
    ShowError('Table schema error', `Details:${getErrorMsg(ex)}`);
  }
  return undefined;
};

export interface ITableDataPProps {
  schemaKey: string;
  index: number;
  size: number;
  SortBy: Array<SortInfo>;
  SearchStr?: string;
  entityId?: string;
}

export const getTableData = async (rx: ITableDataPProps) => {
  try {
    const request = { index: rx.index, size: rx.size, SortBy: rx.SortBy, SearchStr: rx.SearchStr, entityId: rx.entityId };
    const resp = await axios.post<IGenericListResponse<any>>(`/qry/schema/${rx.schemaKey}`, request);
    if (resp.data?.result) {
      const rs = resp.data?.result;
      return rs;
    } else throw new Error(`Failed to retrive `);
  } catch (ex) {
    ShowError('Table schema error', `Details:${getErrorMsg(ex)}`);
  }
  return undefined;
};

export const getCodes = async <T extends IEntity>(baseUrl: string, id?: number) => {
  try {
    const request = { keyId: id, index: 0, size: 100 };
    const resp = await axios.post<IGenericListResponse<T>>(baseUrl, request);
    const data = resp.data;
    if (data.failed) {
      ShowError('Failed', `${data.messages}`);
    }
    return data.result;
  } catch (ex) {
    ShowError('Table data error', `Details:${getErrorMsg(ex)}`);
  }
  return undefined;
};
