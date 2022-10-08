import { getErrorMsg, IApiResponse, IDomainResponse, IFormSchema, IFormSchemaField } from '@dotars/di-core';
import { Button, Divider, Group, ScrollArea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { yupToFormErrors } from 'formik';
import { hasOwnProperty } from 'fast-json-patch/module/helpers';
import {  useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ConfirmBtn, ShowInfo } from '../controls';
import { formStyles } from '../styles';
import { MdlContext } from './Context';
import { SchemaFieldFactory } from './fields/SchemaFieldFactory';
import { SchemaFieldGroup } from './fields/SchemaFieldGroup';
import * as Yup from 'yup';
import { buildYupObj } from './Validation';
import axios from 'axios';

export interface DialogFormProps {
  title?: string;
  schemaKey: string;
  schema: IFormSchema;
  // modalId: string;
  entityId?: string;
  initialValues?: Record<string, string>;
}

export const DialogForm: React.FC<DialogFormProps> = (rx) => {
  const { classes } = formStyles();
  const modals = useModals();
  const [apiError, setApiError] = useState('');
  const [, setDomResponse] = useState<IDomainResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { modalId } = useContext(MdlContext);
  const [pageData, setPageData] = useState<IFormSchemaField>(rx.schema.fields[0]);
  const [valSchema, setValSchema] = useState({});
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});
  const initVals = useMemo<Record<string, string>>(() => {
    if (rx.initialValues) return rx.initialValues;
    return {};
  }, [rx]);
  const getVal = (fd: IFormSchemaField, vs: any) => {
    buildYupObj(fd, vs);
    if (hasOwnProperty(initVals, fd.key)) {
      return `${initVals[fd.key]}`;
    }
    return '';
  };
  useEffect(() => {
    const newData = rx.schema.fields[0];
    const _valSchema = {};
    setPageData(newData);
    setValues((cv) => {
      const newValues = newData.fields.reduce((obj, fd) => {
        if (fd.layout === 2) {
          for (const sf of fd.fields) {
            obj[sf.key] = getVal(sf, _valSchema);
          }
        } else {
          obj[fd.key] = getVal(fd, _valSchema);
        }
        return obj;
      }, {} as Record<string, any>);
      setValSchema(_valSchema);
      return Object.assign({}, newValues, cv);
    });
  }, [rx]);

  const ys = Yup.object().shape(valSchema);
  const onFieldChange = (fkey: string, value: any) => {
    setValues((cv) => {
      cv[fkey] = value;
      return cv;
    });
    setPageData((pgdata) => {
      return Object.assign({}, pgdata);
    });
    //---
    try {
      ys.validateSyncAt(fkey, values, { abortEarly: false });
      setErrors((prevState) => {
        const state = { ...prevState };
        state[fkey] = undefined;
        return state;
      });
    } catch (err) {
      const evals = yupToFormErrors(err);
      setErrors((prevState) => {
        const state = { ...prevState };
        state[fkey] = (evals as any)[fkey];
        return state;
      });
    }
  };

  const validate = () => {
    setErrors({});
    try {
      ys.validateSync(values, { abortEarly: false });
      return {};
    } catch (err) {
      const evals = yupToFormErrors(err);
      setErrors(evals);
      return evals;
    }
  };

  const onCancel = () => {
    modals.closeModal(modalId);
  };
  const onSubmit  = useCallback(async () => {
    try {
      setLoading(true);
      const payLoad = { schema: rx.schemaKey, data: values, entityId: rx.entityId };
      const resp = await axios.post<IApiResponse>(`/forms/dialog`, payLoad);
      if (resp.data.failed || resp.data.result === null) {
        if (resp.data.result == null) setApiError('No response received');
        else setApiError(`${resp.data.messages}`);
      } else {
        ShowInfo('Done!', ``);
        modals.closeModal(modalId);
      }
    } catch (err) {
      setApiError(`${getErrorMsg(err)}`);
    } finally {
      setLoading(false);
    }
  }, [modalId, modals, rx.entityId, rx.schemaKey, values]);

  return (
    <div className={classes.wizard}>
      <div className={classes.ptContent}>
        <ScrollArea style={{ height: 350 }} type="auto" offsetScrollbars>
          {pageData.fields.map((field) => {
            switch (field.layout) {
              case 2:
                return <SchemaFieldGroup key={field.key} field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={false} />;
              case 4:
                return <Divider key={field.key} label={field.title} style={{ marginTop: 15 }} />;
              default:
                return <SchemaFieldFactory key={field.key} field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={field.disabled} readonly={field.readonly} />;
            }
          })}
        </ScrollArea>
      </div>
      <div className={classes.wzFooter}>
        <Group spacing="sm" position="right">
          <Group spacing={5}>
            <Button variant="filled" color="dotars" size="xs" className={classes.wzButton} onClick={onSubmit}>
              Execute
            </Button>
            <ConfirmBtn variant="light" color="red" size="xs" style={{ marginLeft: 5 }} OnOk={onCancel} btnTxt="Cancel" confirmTxt="Are you sure you want to cancel" />
          </Group>
        </Group>
      </div>
    </div>
  );
};
