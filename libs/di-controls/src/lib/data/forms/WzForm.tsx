import { getErrorMsg, IApiResponse, IDataResponse, IDomainResponse, IFormSchema, IFormSchemaField, IFormSchemaResult } from '@dotars/di-core';
import { Alert, Avatar, Button, Collapse, Grid, Group, List, LoadingOverlay, ScrollArea, Table, Text, UnstyledButton } from '@mantine/core';
import { useModals } from '@mantine/modals';
import axios from 'axios';
import { yupToFormErrors } from 'formik';
import { useCallback, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { AlertCircle, ChevronLeft, ChevronRight, CircleCheck, CircleDot, CircleMinus } from 'tabler-icons-react';
import * as Yup from 'yup';
import { ConfirmBtn } from '../controls';
import { dataUiStyles } from '../Styles';
import { formStyles } from '../styles/FormStyles';
import { WizField, WizGroup } from './Controls';
import { PageInfo, ResultState, WizardContext } from './FormContext';
import { buildYupObj } from './Validation';

export interface WzFormProps {
  title: string;
  schema: string;
  onClose?: () => void;
}

export const WzForm: React.FC<WzFormProps> = (rx) => {
  const { classes } = dataUiStyles();
  const modals = useModals();
  let modalId = '';
  const queryClient = new QueryClient();
  const openWizard = () => {
    modalId = modals.openModal({
      title: `${rx.title}`,
      centered: true,
      size: '75%',
      overflow: 'outside',
      withCloseButton: false,
      closeOnClickOutside: false,
      closeOnEscape: false,
      onClose: () => {
        if (rx.onClose) rx.onClose();
      },
      children: (
        <QueryClientProvider client={queryClient}>
          <WzFormView schema={rx.schema} modalId={modalId} title={rx.title} />
        </QueryClientProvider>
      ),
    });
  };

  return (
    <Button variant="filled" color="dotars" className={classes.toolButton} onClick={() => openWizard()}>
      {rx.title}
    </Button>
  );
};

export interface WzFormViewProps {
  title: string;
  schema: string;
  modalId: string;
}

const WzFormView: React.FC<WzFormViewProps> = (rx) => {
  const fetchData = async () => {
    try {
      const rsp = await axios.get<IDataResponse<IFormSchemaResult>>(`/forms/schema/${rx.schema}`);
      if (rsp.data.failed) throw new Error(`Failed to get ${rsp.data.messages} `);
      if (rsp.data?.result?.schema) return rsp.data.result.schema;
      throw new Error(`Failed to retrieve form schema`);
    } catch (ex) {
      throw new Error(`API error:${getErrorMsg(ex)}`);
    }
  };
  const { isLoading, error, data, isSuccess } = useQuery([rx.schema], () => fetchData(), { keepPreviousData: false, staleTime: Infinity });
  return (
    <>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && <RenderWizard schemaKey={rx.schema} schema={data} modalId={rx.modalId} title={rx.title} />}
    </>
  );
};

const WizCmdBar: React.FC = () => {
  const { classes } = formStyles();
  const { pages, page, setPage, closeModal, canGoNext, submit, processState } = useContext(WizardContext);
  const onCancel = () => {
    if (closeModal) closeModal();
  };
  const onPrev = () => {
    if (setPage) setPage(page > 1 ? page - 1 : 0);
  };
  const onNext = () => {
    if (setPage && canGoNext()) setPage(page < pages.length ? page + 1 : pages.length);
  };
  const onSubmit = () => {
    if (submit) submit();
  };
  return (
    <div className={classes.wzFooter}>
      <Group spacing="sm" position="apart">
        <Group spacing={2} position="left">
          <Button variant="default" size="xs" className={classes.wzButton} leftIcon={<ChevronLeft />} onClick={onPrev} disabled={page === 0 || processState === 'SUCCESS'}>
            Previous
          </Button>
        </Group>
        <Group spacing={2} position="center">
          <Text size="xs" color="dimmed">
            Step{' '}
            <strong>
              {page + 1} of {pages.length}
            </strong>{' '}
          </Text>
        </Group>
        <Group spacing={0} position="right">
          <Button variant="filled" color="dotars" size="xs" className={classes.wzButton} onClick={onSubmit} disabled={page !== pages.length - 1 || processState === 'SUCCESS'}>
            Create
          </Button>
          <Button variant="default" size="xs" className={classes.wzButton} rightIcon={<ChevronRight />} onClick={onNext} disabled={page === pages.length - 1}>
            Next
          </Button>
          <ConfirmBtn variant="light" color="red" size="xs" style={{ marginLeft: 5 }} OnConfirm={onCancel} disabled={processState === 'SUCCESS'} btnTxt="Cancel" confirmTxt="Are you sure you want to cancel" />
        </Group>
      </Group>
    </div>
  );
};

const WizNavBar: React.FC = () => {
  const { classes, cx } = formStyles();
  const { current, page, pages, setPage, canGoNext, processState } = useContext(WizardContext);
  const onSelect = (idx: number, pg: PageInfo) => {
    if (setPage && canGoNext()) {
      if (setPage) setPage(idx);
    }
  };
  const RenderIcon = (pi: PageInfo) => {
    switch (pi.state) {
      case 'CURRENT':
        return <CircleDot  color="#071E3E" />;
      case 'ERROR':
        return <AlertCircle color="red" />;
      case 'SUCCESS':
        return <CircleCheck color="green" />;
      default:
        return <CircleMinus />;
    }
  };
  const PageStateIcon = (pi: PageInfo) => {
    if (processState === 'SUCCESS') return <CircleCheck color="green" />;
    if (current?.id === pi.id) return <RenderIcon {...current} />;
    else return <RenderIcon {...pi} />;
  };

  return (
    <div className={classes.wzNavBar}>
      <Table verticalSpacing="xs" width={250}>
        <tbody>
          {pages &&
            pages.map((pg, index) => {
              const selected = pages[page] && pages[page].id === pg.id;
              return (
                <tr key={index} className={cx({ [classes.pgSelected]: selected })} style={{ padding: 0 }}>
                  <td style={{ padding: 0 }}>
                    <UnstyledButton onClick={() => onSelect(index, pg)} style={{ width: '100%', padding: 10 }} disabled={processState === 'SUCCESS'}>
                      <Group spacing="sm" position="left">
                        <Avatar radius="sm" size={25}>
                          <PageStateIcon {...pg} />
                        </Avatar>
                        <div>
                          <Text size="sm" color={selected ? 'white' : 'dotars'} weight={500}>
                            {pg.title}
                          </Text>
                          <Text color={selected ? 'white' : 'dimmed'} size="xs">
                            {pg.desc}
                          </Text>
                        </div>
                      </Group>
                    </UnstyledButton>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};
export interface RenderWizardProps {
  title: string;
  schemaKey: string;
  schema: IFormSchema;
  modalId: string;
}

const RenderWizard: React.FC<RenderWizardProps> = (rx) => {
  const { classes } = formStyles();
  const modals = useModals();
  const [loading, setLoading] = useState(false);
  const [processState, setProcessState] = useState<ResultState>('INIT');
  const [page, setPage] = useState<number>(0);
  const [current, setCurrent] = useState<PageInfo | undefined>(undefined);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [pageData, setPageData] = useState<IFormSchemaField>(rx.schema.fields[page]);
  const [valSchema, setValSchema] = useState({});
  const [pages] = useState<Array<PageInfo>>(() => {
    const pages = rx.schema.fields.map((x) => ({ id: x.key, title: x.title, desc: x.description, state: 'INIT' } as PageInfo));
    return [...pages, { id: 'summary', title: 'Summary', desc: 'Review and submit', state: 'INIT' }];
  });
  const closeModal = () => {
    modals.closeModal(rx.modalId);
  };
  const getVal = (fd: IFormSchemaField, vs: any) => {
    buildYupObj(fd, vs);
    return '';
  };
  useEffect(() => {
    if (page < pages.length - 1) {
      const newData = rx.schema.fields[page];
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
      const cp = pages[page];
      cp.state = 'CURRENT';
      setCurrent(cp);
    }
  }, [page, pages, rx]);

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
    if (current) current.state = Object.values(errors).filter((x) => x !== undefined).length > 0 ? 'ERROR' : 'SUCCESS';
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

  const canGoNext = () => {
    const errs = validate();
    const isValid = Object.keys(errs).length > 0 ? false : true;
    if (current) current.state = !isValid ? 'ERROR' : 'SUCCESS';
    return isValid;
  };

  const [apiError, setApiError] = useState('');
  const [, setDomResponse] = useState<IDomainResponse | undefined>(undefined);
  const submitData = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await axios.post<IApiResponse>(`/forms/process`, { schema: rx.schemaKey, data: values });
      if (resp.data.failed || resp.data.result === null) {
        if (resp.data.result == null) setApiError('No response received');
        else setApiError(`${resp.data.messages}`);
        setProcessState('ERROR');
      } else {
        setDomResponse(resp.data.result);
        setProcessState('SUCCESS');
      }
    } catch (err) {
      setApiError(`${getErrorMsg(err)}}`);
      setProcessState('ERROR');
    } finally {
      setLoading(false);
    }
  }, [rx, values]);

  const submit = async () => {
    await submitData();
  };
  const RenderSummary = () => {
    return (
      <div className={classes.wzSummary}>
        <Collapse in={processState === 'INIT'}>
          <List size="sm">
            {Object.entries(values)
              .filter(([key, value]) => value !== null && value.length >0 )
              .map(([key, value]) => {
                return (
                  <List.Item>
                    {key}: {value}{' '}
                  </List.Item>
                );
              })}
          </List>
        </Collapse>
        <Collapse in={processState === 'ERROR'}>
          <Alert icon={<AlertCircle size={16} />} title="Error!" color="red">
            {apiError}
          </Alert>
        </Collapse>
        <Collapse in={processState === 'SUCCESS'}>
          <Alert icon={<AlertCircle size={16} />} title="Success!">
            {`Sucessfully completed -'${rx.title}'`}
          </Alert>
          <Group position="center" style={{ marginTop: 25 }}>
            <Button
              variant="filled"
              color="dotars"
              size="sm"
              onClick={() => {
                closeModal();
              }}
            >
              OK
            </Button>
          </Group>
        </Collapse>
      </div>
    );
  };

  return (
    <WizardContext.Provider value={{ current, pages, page, setPage, closeModal, values, errors, canGoNext, submit, processState }}>
      <Grid justify="space-between">
        <Grid.Col span={3} className={classes.navPanel}>
          <WizNavBar />
        </Grid.Col>
        <Grid.Col span={9} className={classes.cntPanel}>
          <LoadingOverlay visible={loading} />
          <div className={classes.wizard}>
            <div className={classes.wzheader}>
              <Group position="apart">
                <Group position="left">
                  <Text color="dotars" weight="bold">
                    {page === pages.length - 1 ? 'Review and submit' : pages[page].title}
                  </Text>{' '}
                </Group>
                <Group position="right">{current?.state && current?.state === 'ERROR' && <AlertCircle color="red" />}</Group>
              </Group>
            </div>
            <div className={classes.ptContent}>
              <ScrollArea style={{ height: 350 }} type="auto" offsetScrollbars>
                {page === pages.length - 1 && <RenderSummary />}
                {page < pages.length - 1 &&
                  pageData.fields.map((field) => {
                    switch (field.layout) {
                      case 2:
                        return <WizGroup key={field.key} field={field} fieldChanged={onFieldChange} values={values} />;
                      default:
                        return <WizField key={field.key} field={field} fieldChanged={onFieldChange} values={values} />;
                    }
                  })}
              </ScrollArea>
            </div>
            <WizCmdBar />
          </div>
        </Grid.Col>
      </Grid>
    </WizardContext.Provider>
  );
};