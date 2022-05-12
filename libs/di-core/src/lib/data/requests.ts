export interface IEntity {
  id: number;
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



export interface IChangeRequest {
  name: string;
  id: number;
  action: number;
  reason: string;
}
