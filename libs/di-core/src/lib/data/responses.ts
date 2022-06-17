import { ICodeRecord, IEntity } from './requests';

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

export const NoOpResponse: IApiResponse = { reason: 0, failed: false, messages: null, result: null };

export interface IDataResponse<T extends object> {
  reason: number;
  failed: boolean;
  messages: Array<string> | null;
  result: T | null;
}

// ---- sitemap

export interface NavLink {
  route?: string;
  icon?: string;
  label: string;
  desc?: string;
  links?: Array<NavLink>;
}

export class SiteSettings {
  logo?: string;
  icon?: string;
  navigation?: Array<NavLink>;
  footer?: NavLink;
}


export interface ISitemap {
  logo: string;
  icon: string;
  Navigation: Array<string>;
}


// ---- table schema
export interface ITableDef {
  schema: ISchemaDef;
}
export interface ISchemaDef {
  title: string;
  columns: Array<IColumnDef>;
}
export interface IColumnDef {
  accessor: string;
  Header: string;
  width: number;
  format: string | null;
  type: number;
  typeCode: string | null;
  options: any;
  linkPath: string;
  linkId: string;
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

// ---- form Schema schema

export interface IEntityState {
  title: string;
  id: number;
  locked: boolean;
  disabled: boolean;
  deleted: boolean;
}
export interface IFormSchemaResult {
  entity: IEntityState;
  initialValues?: Record<string, string>;
  schema: IFormSchema;
}
export interface IFormSchema {
  name: string;
  fields: IFormSchemaField[];
}
export interface IRule {
  type: string;
  data: Array<any>;
}
export interface IFormSchemaField {
  key: string;
  layout: number;
  fieldType: number;
  title?: string;
  description?: string;
  disabled: boolean;
  readonly: boolean;
  options: any;
  value: any;
  width?: number;
  fields: IFormSchemaField[];
  valType: string;
  viewId: string;
  required: boolean;
  rules?: Array<IRule>;
}
