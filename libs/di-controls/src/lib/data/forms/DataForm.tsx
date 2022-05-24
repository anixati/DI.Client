import { IApiResponse, IEntity, useEntityContext } from '@dotars/di-core';
import { LoadingOverlay } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import * as jpatch from 'fast-json-patch';
import { Form, Formik, FormikHelpers, FormikProps, useFormikContext } from 'formik';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { AlertOctagon, CircleCheck } from 'tabler-icons-react';
import { dispatch } from 'use-bus';
import { dataUiStyles } from '../Styles';
import { EntityBar } from './EntityBar';
import { EntityView } from './EntityView';

export interface DataFormProps<T extends IEntity> {
  baseUrl: string;
  canLock: boolean;
  initial: T;
  actions?: ReactNode;
  schema?:unknown | (() => unknown);
  validate?: (values: T) => boolean;
  renderForm: (form: FormikProps<T>,isNew:boolean) => React.ReactNode;
}

export const DataForm = <T extends IEntity>(rx: PropsWithChildren<DataFormProps<T>>) => {
  const { classes } = dataUiStyles();

  const ectx = useEntityContext();
  const isNew = ectx?.entity === undefined;
  const [entity, setEntity] = useState<T>(rx.initial);
  // useEffect(() => {
  //   //if (ectx?.entity) setEntity(ectx.entity as T);
  //   //else setEntity(rx.initial);
  // }, [ectx,rx]);

  const handleApiResponse = (item: T, data: IApiResponse) => {
    if (data.failed) {
      showNotification({ message: `${data.messages}`, color: 'red', icon: <AlertOctagon /> });
    } else {
      setEntity(rx.initial);
      showNotification({ message: 'Created Sucessfully!', color: 'green', icon: <CircleCheck /> });
      dispatch({ type: 'RELOADSELECTED', payload: item });
    }
  };
  const createItem = async (item: T) => {
    await axios.post<IApiResponse>(`${rx.baseUrl}/create`, item).then((rs) => {
      handleApiResponse(item, rs.data);
    });
  };
  const UpdateItem = async (item: T) => {
    const original = ectx?.entity as T;
    if (original) {
      const changeSet = jpatch.compare(original, item);
      if (Array.isArray(changeSet)) {
        await axios.patch<IApiResponse>(`${rx.baseUrl}/${original.id}`, changeSet).then((rs) => {
          handleApiResponse(item, rs.data);
        });
      }
    }
  };

  const handleSubmit = async (data: T, actions: FormikHelpers<T>) => {
    const errors = await actions.validateForm();
    if (Object.keys(errors).length !== 0) {
      console.log('errors ..',errors);
      return;
    }
    if (data) {
      try {
        console.log('submitting ..',data);
        actions.setSubmitting(true);
        // ectx?.showLoading(true);
        if (rx.validate) {
          //if (!rx.validate(data)) 
        }
        if (data.id === 0) createItem(data);
        else UpdateItem(data);
      } finally {
        //ectx?.showLoading(false);
        actions.setSubmitting(false);
      }
    }
  };

  return (
    <Formik initialValues={entity} onSubmit={async(v,f) => await handleSubmit(v,f)} validationSchema={rx.schema}>
      {(props) => <FormDetails {...rx}>{rx.renderForm(props,isNew)}</FormDetails>}
    </Formik>
  );
};

interface FormDetailsProps {
  baseUrl: string;
  canLock: boolean;
  actions?: ReactNode;
}

const FormDetails: React.FC<FormDetailsProps> = (rx) => {
  const { values, submitForm, isSubmitting, isValid } = useFormikContext();
  // const [, SetDisabled] = useAtom(disableToolbar);
  const onCreate = () => {
    if (isValid) submitForm();
  };
  const onUpdate = () => {
    if (isValid) submitForm();
  };
  return (
    <EntityView name="Option" toolBar={<EntityBar disabled={false} url={`${rx.baseUrl}/change`} OnCreate={onCreate} onUpdate={onUpdate} canLock={rx.canLock} actions={rx.actions} />}>
      <Form>
        {/* {SetDisabled(isSubmitting)} */}
        <LoadingOverlay visible={isSubmitting} />
        {rx.children}
      </Form>
    </EntityView>
  );
};