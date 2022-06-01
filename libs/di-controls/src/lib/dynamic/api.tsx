import { getErrorMsg, IApiResponse, IChangeRequest, IDataResponse, IFormSchemaResult } from '@dotars/di-core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { AlertOctagon, CircleCheck } from 'tabler-icons-react';

export const getCreateSchemaData = async (schemaName: string) => {
  try {
    const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(`/forms/create/${schemaName}`);
    if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
    if (rsp.data?.result?.schema) return rsp.data.result.schema;
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

export const submiUpdateForm = async (schemaName: string, entityId: number,changeSet:any) => {
  try {
    const patchResp = await axios.patch<IApiResponse>(`/forms/update/${schemaName}/${entityId}`,changeSet);
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

const ShowNotify = (action: number, data: IApiResponse) => {
  let title = '';
  switch (action) {
    case 2: {
      title = 'Enabled Sucessfully!';
      break;
    }
    case 3: {
      title = 'Disabled Sucessfully!';
      break;
    }
    case 4: {
      title = 'Locked Sucessfully!';
      break;
    }
    case 5: {
      title = 'Unlocked Sucessfully!';
      break;
    }
    case 6: {
      title = 'Deleted Sucessfully!';
      break;
    }
  }
  ShowInfo(`${title}`, `${data?.result?.message}`);
};
const ShowError = (title: string, message: string) => {
  showNotification({ autoClose: 5000, title, message, color: 'red', icon: <AlertOctagon /> });
};
const ShowInfo = (title: string, message: string) => {
  showNotification({ autoClose: 5000, title, message, color: 'blue', icon: <CircleCheck /> });
};
