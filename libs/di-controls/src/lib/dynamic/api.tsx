import { getErrorMsg, IApiResponse, IChangeRequest, IDataResponse, IFormSchemaResult } from '@dotars/di-core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { AlertOctagon } from 'tabler-icons-react';

export const getCreateSchemaData = async (schemaName: string) => {
  try {
    const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(`/forms/schema/${schemaName}`);
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

export const submiUpdateForm = async (schemaName: string, entityId: number) => {
  try {
    const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(`/forms/update`);
    if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
    if (rsp.data?.result) return rsp.data.result;
    throw new Error(`Failed to retrieve form schema`);
  } catch (ex) {
    throw new Error(`API error:${getErrorMsg(ex)}`);
  }
};

export const submitChangeForm = async (schemaName: string, request: IChangeRequest) => {
  const resp = await axios.post<IApiResponse>(`/forms/change/${schemaName}`, request);
  const data = resp.data;
  if (data.failed) {
    console.log(data);
    ShowError('Failed to change state', `${data.messages}`);
  } else {
    ShowNotify(request.action, data);
  }
  return data;
};

const ShowNotify = (action: number, data: IApiResponse) => {
  let title = '';
  let notifyMsg = 'RELOAD';
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
      notifyMsg = 'ONDELETE';
      break;
    }
  }
  showNotification({ autoClose: 5000, title: `${title}`, message: `${data?.result?.message}`, color: 'blue', icon: <AlertOctagon /> });
};
const ShowError = (title: string, message: string) => {
  showNotification({ autoClose: 5000, title, message, color: 'red', icon: <AlertOctagon /> });
};