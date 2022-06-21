import { getErrorMsg } from '@dotars/di-core';
import { Alert, Button, LoadingOverlay } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { MultiSelectForm, WizardForm } from '.';
import { dataUiStyles } from '../styles/Styles';
import { getCreateSchemaData } from './api';
import { IActionFormBtnProps, MdlContext } from './Context';

export const ActionFormBtn: React.FC<IActionFormBtnProps> = (rx) => {
  const { classes } = dataUiStyles();
  const modals = useModals();
  const [modalId, SetModalId] = useState<string>('');
  const queryClient = new QueryClient();
  const { entityId } = useParams();

  const openWizard = () => {
    const mid = modals.openModal({
      title: `${rx.title}`,
     // centered: true,
      size: '85%',
      overflow: 'outside',
      withCloseButton: false,
      closeOnClickOutside: false,
      closeOnEscape: false,
      zIndex: 100,
      onClose: () => {
        if (rx.onClose) rx.onClose();
      },
      children: (
        <MdlContext.Provider value={{ modalId }}>
          <QueryClientProvider client={queryClient}>
            <FormSelector entityId={entityId} {...rx} />
          </QueryClientProvider>
        </MdlContext.Provider>
      ),
    });
    SetModalId(mid);
    setTimeout(SetModalId, 500, mid);
  };

  return (
    <Button size="xs" variant="filled" color="dotars" className={classes.toolButton} onClick={() => openWizard()}>
      {rx.title}
    </Button>
  );
};

const FormSelector: React.FC<IActionFormBtnProps> = (rx) => {
  const { isLoading, error, data, isSuccess } = useQuery([rx.schema], () => getCreateSchemaData(rx.action?rx.action:"create",rx.schema, rx.entityId), { keepPreviousData: false, staleTime: Infinity });
  if (isLoading) return <LoadingOverlay visible={true} />;
  if (error)
    return (
      <Alert title="Error!" color="red">
        {getErrorMsg(error)}
      </Alert>
    );
  if (isSuccess && data) {
    console.log(data,"#####")
    switch (data.schema.formType) {
      case 1:
        return <WizardForm schemaKey={rx.schema} schema={data.schema} initialValues={data.initialValues} title={rx.title} entityId={rx.entityId} />;
      case 2:
        return <MultiSelectForm schemaKey={rx.schema} options={data.schema?.options} initialValues={data.initialValues} title={rx.title} entityId={rx.entityId}/>
      default:
        return <>..TODO.</>;
    }
  }
  return null;
};
