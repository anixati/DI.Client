import { getErrorMsg, IDataResponse, IFormSchemaResult } from "@dotars/di-core";
import axios from "axios";


export const getCreateSchemaData = async (schemaName:string) => {
    try {
      const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(`/forms/schema/${schemaName}`);
      if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
      if (rsp.data?.result?.schema) return rsp.data.result.schema;
      throw new Error(`Failed to retrieve form schema`);
    } catch (ex) {
      throw new Error(`API error:${getErrorMsg(ex)}`);
    }
  };

  

export const getViewSchemaData = async (schemaName:string,entityId:string) => {
  try {
    const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(`/forms/schema/${schemaName}/${entityId}`);
    if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
    if (rsp.data?.result) return rsp.data.result;
    throw new Error(`Failed to retrieve form schema`);
  } catch (ex) {
    throw new Error(`API error:${getErrorMsg(ex)}`);
  }
};