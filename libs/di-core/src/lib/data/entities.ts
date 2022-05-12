import { IAuditedRecord, IEntity } from './requests';
import * as Yup from 'yup';

//---ype help
const emptyStrToNull = (value: unknown, originalValue: unknown) => {
  return typeof originalValue === 'string' && originalValue === '' ? null : value;
};

//-------

export interface IAddress {
  unit?: string;
  street?: string;
  city?: string;
  postcode?: number;
  state?: string;
  country?: string;
}

export const AddressSchema = Yup.object().shape({
  unit: Yup.string().nullable(),
  street: Yup.string().nullable(),
  city: Yup.string().nullable(),
  postcode: Yup.number().transform(emptyStrToNull).nullable(),
  state: Yup.string().nullable(),
  country: Yup.string().nullable(),
});

export interface IContactType extends IAuditedRecord {
  fullName?: string;
  title?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: number;
  homePhone?: string;
  mobilePhone?: string;
  email1?: string;
  email2?: string;
  streetAddress?: IAddress;
  postalAddress?: IAddress;
}

export interface IAppUser extends IContactType {
  userId: string;
}

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

export const UserSchema = Yup.object({
  userId: Yup.string().required('User Id is required.').min(3, 'User Id must be atleast 3 characters.'),
  firstName: Yup.string().required('First Name is required.').min(3, 'First Name must be atleast 3 characters.'),
  lastName: Yup.string().required('Last Name is required.').min(3, 'Last Name must be atleast 3 characters.'),
  email1: Yup.string().nullable().notRequired().email(),
  email2: Yup.string().nullable().notRequired().email(),
  homePhone: Yup.string().nullable().notRequired().matches(phoneRegExp, 'Phone no is not valid.'),
  mobilePhone: Yup.string().nullable().notRequired().matches(phoneRegExp, 'Phone no is not valid.'),
  streetAddress: AddressSchema.required(),
});

export const NewUser: IAppUser = { id: 0, userId: '', fullName: '', title: '', firstName: '', lastName: '', middleName: '', gender: undefined, homePhone: '', mobilePhone: '', email1: '', email2: '', streetAddress: { unit: '', street: '', city: '', postcode: 0, state: '', country: '' } };





export interface IAuditProp{
  key?: string;
  oldValue?: string;
  newValue?: string;
}
export interface IAuditLog extends IEntity {
  auditDate?: string;
  action?: string;
  tableName?: string;
  data?: Array<IAuditProp>;
}

