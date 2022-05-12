import { ICodeRecord, IEntity } from "./requests";

export interface IDomainResponse {
    item: unknown;
    reason: number;
    changeCode: number;
    message: string;
  }
  
  export interface IApiResponse {
    reason: number;
    failed: boolean;
    messages: Array<string> | null;
    result: IDomainResponse | null;
  }

  export const NoOpResponse:IApiResponse = { reason: 0, failed:false, messages: null,  result: null};


  
export interface IListResponse {
    pageIndex: number;
    pageSize: number;
    pageCount: number;
    total: number;
    hasPrevious: boolean;
    hasNext: true;
  }
  
  export interface IDataList extends IListResponse {
    items: Array<ICodeRecord>;
  }
  
  export interface IDataListResponse {
    reason: number;
    failed: boolean;
    messages: Array<string> | null;
    result: IDataList | null;
  }
  
  export interface IGenericListResponse<T extends IEntity> {
    reason: number;
    failed: boolean;
    messages: Array<string> | null;
    result?: IPagedList<T>;
  }
  export interface IPagedList<T extends IEntity> extends IListResponse {
    items: Array<T>;
  }