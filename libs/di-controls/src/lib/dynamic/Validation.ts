import { IFormSchemaField } from '@dotars/di-core';
import * as Yup from 'yup';

const yupObj = (fd: IFormSchemaField) => {
  switch (fd.fieldType) {
    default:
      return Yup.string();
  }
};

export const buildYupObj = (fd: IFormSchemaField, vs: any) => {
  if (fd.rules) {
    let vdr = yupObj(fd);
    if (fd.required) vdr.required();
    else vdr.nullable(true);
    fd.rules.forEach((vd) => {
      const { type, data } = vd;
      if (type === 'regex') {
        //const rexp = new RegExp(`${data[0]}`);
        //console.log(type,data[0], data[1], '------');
        const rexp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

        vdr = vdr.matches(rexp,{message:`${data[1]}`,excludeEmptyString:fd.required?false:true} );
        return;
      }
      if (!(vdr as any)[type]) {
        console.log(type, 'val not found');
        return;
      }
      //console.log(type, data);
      vdr = (vdr as any)[type](...data);
    });
    vs[fd.key] = vdr;
  }
};
