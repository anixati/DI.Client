import { getErrorMsg, IDataResponse, IEntity, IFormSchemaResult, IGenericListResponse, ITableDef } from '@dotars/di-core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { AlertOctagon, CircleCheck } from 'tabler-icons-react';

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
      console.log(data);
      showNotification({ message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
    }
    return data.result;
  } catch (ex) {
    ShowError('Table data error', `Details:${getErrorMsg(ex)}`);
  }
  return undefined;
};

//-------
const ShowError = (title: string, message: string) => {
  showNotification({ autoClose: 5000, title, message, color: 'red', icon: <AlertOctagon /> });
};
const ShowInfo = (title: string, message: string) => {
  showNotification({ autoClose: 5000, title, message, color: 'blue', icon: <CircleCheck /> });
};
