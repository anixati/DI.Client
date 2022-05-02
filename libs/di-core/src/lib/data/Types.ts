export interface IEntity {
  id?: number;
  isLocked?: boolean;
  isDisabled?: boolean;
}

export interface IAuditedRecord extends IEntity {
  createdByStamp?: string;
  modifiedByStamp?: string;
}

export interface INamedRecord extends IAuditedRecord {
  name: string;
  description: string;
}

export interface ICodeRecord extends INamedRecord {
  code: string;
}

export interface IListRequest {
  index: number;
  size: number;
}

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


export interface IChangeRequest {
  name: string;
  id: number;
  action: number;
  reason: string;
}

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
