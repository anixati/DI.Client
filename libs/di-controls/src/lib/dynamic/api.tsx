import { getErrorMsg, IApiResponse, IChangeRequest, IDataResponse, IFormSchemaResult } from '@dotars/di-core';
import axios from 'axios';
import { ShowError, ShowInfo, ShowNotify } from '../controls';

export const getCreateSchemaData = async (action: string,schemaName: string, entityId?: string) => {
  try {
    const url = entityId !== undefined ? `/forms/${action}/${schemaName}/${entityId}` : `/forms/create/${schemaName}`;
    const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(url);
    if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
    if (rsp.data?.result) return rsp.data.result;
    throw new Error(`Failed to retrieve form schema`);
  } catch (ex) {
    throw new Error(`API error:${getErrorMsg(ex)}`);
  }
};

export const getViewSchemaData = async (schemaName: string, entityId: string) => {
  try {
    const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(`/forms/view/${schemaName}/${entityId}`);
    if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
    if (rsp.data?.result) return rsp.data.result;
    throw new Error(`Failed to retrieve form schema`);
  } catch (ex) {
    throw new Error(`API error:${getErrorMsg(ex)}`);
  }
};

export const submiUpdateForm = async (schemaName: string, entityId: number, changeSet: any) => {
  try {
    const patchResp = await axios.patch<IApiResponse>(`/forms/update/${schemaName}/${entityId}`, changeSet);
    const data = patchResp.data;
    if (data.failed) {
      console.log(data);
      ShowError('Failed to update', `${data.messages}`);
      return false;
    } else {
      ShowInfo('Updated Sucessfully!', `${data?.result?.message}`);
      return true;
    }
  } catch (err) {
    ShowError('Failed', `API error:${getErrorMsg(err)}`);
    return false;
  }
};

export const submitChangeForm = async (schemaName: string, request: IChangeRequest) => {
  try {
    const resp = await axios.post<IApiResponse>(`/forms/change/${schemaName}`, request);
    const data = resp.data;
    if (data.failed) {
      console.log(data);
      ShowError('Failed to change state', `${data.messages}`);
      return false;
    } else {
      ShowNotify(request.action, data);
      return true;
    }
  } catch (err) {
    ShowError('Failed', `API error:${getErrorMsg(err)}`);
    return false;
  }
};

