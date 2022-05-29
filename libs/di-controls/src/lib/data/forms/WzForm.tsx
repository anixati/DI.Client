import { getErrorMsg, IApiResponse, IDataResponse, IDomainResponse, IFormSchema, IFormSchemaField, IFormSchemaResult, IGenericListResponse } from '@dotars/di-core';
import { Alert, Avatar, Button, Center, Collapse, createStyles, Grid, Group, List, LoadingOverlay, Radio, RadioGroup, ScrollArea, Table, Text, Textarea, TextInput, UnstyledButton } from '@mantine/core';
import { useModals } from '@mantine/modals';
import axios from 'axios';
import { yupToFormErrors } from 'formik';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { AlertCircle, ChevronLeft, ChevronRight, CircleCheck, CircleDot, CircleMinus } from 'tabler-icons-react';
import * as Yup from 'yup';
import { ConfirmBtn } from '../controls';
import { dataUiStyles } from '../Styles';

/* #region  wizard form */
export interface WzFormProps {
  title: string;
  schema: string;
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
/* #endregion */

/* #region  wizard form view  */
//---------------------------------------------------------------------------------------------------------------
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
/* #endregion */

/* #region  Styles */
//-------------------------------------------------Styles--------------------------------------------------------------
const wizStyles = createStyles((theme) => ({
  wzSummary: {
    // backgroundColor: '#FFFFF0',
    color: theme.colors['dotars'],
    padding: 15,
  },
  pgSelected: {
    backgroundColor: theme.colors['dotars'], //theme.colors.gray[3],
    color: '#fff',
  },
  navPanel: {
    minHeight: 280,
    padding: 0,
    backgroundColor: theme.colors.gray[1],
    boxShadow: theme.shadows.xs,
  },
  cntPanel: {
    minHeight: 280,
    padding: 5,
    border: `1px solid ${theme.colors.gray[1]}`,
    boxShadow: theme.shadows.xs,
  },
  wizard: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 400,
  },
  wzheader: {
    padding: 5,
    borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    flexBasis: '20px',
  },
  ptContent: {
    background: 'white',
    flexGrow: '1',
    paddingLeft: 4,
    paddingRight: 4,
  },
  wzFooter: {
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
    padding: 5,
    // flexBasis: '50px',
  },
  wzNavBar: {
    padding: 5,
    // flexBasis: '50px',
  },
  wzButton: {
    borderRadius: 0,
    '&:not(:first-of-type)': {
      borderLeftWidth: 0,
    },
    '&:first-of-type': {
      borderTopLeftRadius: theme.radius.sm,
      borderBottomLeftRadius: theme.radius.sm,
    },
    '&:last-of-type': {
      borderTopRightRadius: theme.radius.sm,
      borderBottomRightRadius: theme.radius.sm,
    },
  },
}));
/* #endregion */

/* #region  Context */
//---------------------------------------------------wizard context------------------------------------------------------------
type ResultState = 'INIT' | 'ERROR' | 'SUBMITTING' | 'SUCCESS';
type PageState = 'INIT' | 'ERROR' | 'CURRENT' | 'SUCCESS';
type PageInfo = {
  id: string;
  title?: string;
  desc?: string;
  state: PageState;
};

interface IWizardContext {
  processState: ResultState;
  current?: PageInfo;
  pages: Array<PageInfo>;
  page: number;
  values: Record<string, any>;
  errors: Record<string, any>;
  setPage?: (page: number) => void;
  canGoNext: () => boolean;
  closeModal?: () => void;
  submit?: () => void;
}
const WizardContext = createContext<IWizardContext>({
  processState: 'INIT',
  pages: [],
  page: 0,
  values: {},
  errors: {},
  canGoNext: () => {
    return true;
  },
});

/* #endregion */

//---------------------------------------------------wizard  controls------------------------------------------------------------

/* #region  Command Bar */
const WizCmdBar: React.FC = () => {
  const { classes } = wizStyles();
  //modals.closeModal(rx.modalId);
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
/* #endregion */

/* #region  Navigation Bar */

const WizNavBar: React.FC = () => {
  const { classes, cx } = wizStyles();
  const { current, page, pages, setPage, canGoNext, processState } = useContext(WizardContext);
  const onSelect = (idx: number, pg: PageInfo) => {
    if (setPage && canGoNext()) {
      if (setPage) setPage(idx);
    }
  };
  const RenderIcon = (pi: PageInfo) => {
    switch (pi.state) {
      case 'CURRENT':
        return <CircleDot />;
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

/* #endregion */

//---------------------------------------------------wizard  fields------------------------------------------------------------

/* #region  fields */

interface IFieldProps {
  field: IFormSchemaField;
  fieldChanged: (key: string, value: any) => void;
  values: Record<string, any>;
}

const WizField = (rx: IFieldProps) => {
  const { errors } = useContext(WizardContext);
  const { field, fieldChanged, values } = rx;
  const ph = `Please enter ${field.title}`;
  switch (rx.field.fieldType) {
    case 1:
      return <Textarea required={field.required ? field.required : false} label={field.title} placeholder={ph} style={{ marginTop: 10 }} value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)} size="xs" autosize minRows={3} />;
    case 3:
      return (
        <RadioGroup required={field.required ? field.required : false} label={field.title} description={field.description} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }} value={values[rx.field.key]} error={errors[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e)} size="sm">
          <Radio value="1" label="Yes" />
          <Radio value="0" label="No" />
        </RadioGroup>
      );
    default:
      return <TextInput required={field.required ? field.required : false} label={field.title} placeholder={ph} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }} error={errors[rx.field.key]} value={values[rx.field.key]} onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)} size="xs" />;
  }
};

const WizGroup = (rx: IFieldProps) => {
  const { classes } = wizStyles();
  return (
    <Group key={rx.field.key} spacing={12} position="left">
      {rx.field.fields.map((field) => {
        return <WizField key={field.key} field={field} fieldChanged={rx.fieldChanged} values={rx.values} />;
      })}
    </Group>
  );
};
/* #endregion */

//---------------------------------------------------wizard------------------------------------------------------------

/* #region  YUP */

const yupObj = (fd: IFormSchemaField) => {
  switch (fd.fieldType) {
    default:
      return Yup['string']();
  }
};

const buildYupObj = (fd: IFormSchemaField, vs: any) => {
  if (fd.rules) {
    let vdr = yupObj(fd);
    fd.rules.forEach((vd) => {
      const { type, data } = vd;
      if (!(vdr as any)[type]) {
        return;
      }
      //console.log(type, data);
      vdr = (vdr as any)[type](...data);
    });
    vs[fd.key] = vdr;
  }
};
/* #endregion */

export interface RenderWizardProps {
  title: string;
  schemaKey: string;
  schema: IFormSchema;
  modalId: string;
}

const RenderWizard: React.FC<RenderWizardProps> = (rx) => {
  const { classes } = wizStyles();
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
    //--
    if (current) current.state = Object.values(errors).filter((x) => x !== undefined).length > 0 ? 'ERROR' : 'SUCCESS';
  };

  const validate = () => {
    setErrors({});
    try {
      ys.validateSync(values, { abortEarly: false });
      //pages[page].valid = true;
      return {};
    } catch (err) {
      const evals = yupToFormErrors(err);
      //pages[page].valid = false;
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
  const [domResponse, setDomResponse] = useState<IDomainResponse | undefined>(undefined);
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
            {Object.entries(values).map(([key, value]) => {
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
              <Text color="dotars" weight="bold">
                {page === pages.length - 1 ? 'Review and submit' : pages[page].title}
              </Text>
              {current?.state}
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
