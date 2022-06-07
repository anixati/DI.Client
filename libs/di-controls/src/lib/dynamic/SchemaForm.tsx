import { getErrorMsg, IEntityState, IFormSchemaField, IFormSchemaResult } from '@dotars/di-core';
import { Alert, Badge, Button, Card, Container, Divider, Group, LoadingOverlay, Tabs } from '@mantine/core';
import * as jpatch from 'fast-json-patch';
import { hasOwnProperty } from 'fast-json-patch/module/helpers';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from 'react-query';
import { AlertOctagon, AspectRatio, Bookmark, Photo } from 'tabler-icons-react';
import { ConfirmBtn, PanelHeader } from '../controls';
import { panelStyles } from '../styles';
import { getViewSchemaData, submitChangeForm, submiUpdateForm } from './api';
import { PageInfo, WizardFormContext } from './Context';
import { SchemaFieldFactory } from './SchemaFieldFactory';
import { SchemaFieldGroup } from './SchemaFieldGroup';
import { buildYupObj } from './Validation';
import * as Yup from 'yup';
import { yupToFormErrors } from 'formik';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { SubgridControl } from './Subgrid';

export interface ISchemaFormProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  entityId?: string;
  canEdit: boolean;
  listUrl: string;
}

export const SchemaForm: React.FC<ISchemaFormProps> = (rx) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{rx.entityId && <SchemaFormView canEdit={rx.canEdit} title={rx.title} schema={rx.schema} icon={rx.icon} entityId={rx.entityId} listUrl={rx.listUrl} />}</QueryClientProvider>;
};
export interface ISchemaFormViewProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  entityId: string;
  canEdit: boolean;
  listUrl: string;
}

const SchemaFormView: React.FC<ISchemaFormViewProps> = (rx) => {
  const navigate = useNavigate();
  const viewSchema = useMemo<string>(() => `${rx.schema}`, [rx]);
  const { isLoading, error, data, isSuccess, refetch } = useQuery([viewSchema], () => getViewSchemaData(viewSchema, rx.entityId), { keepPreviousData: false, staleTime: Infinity });
  const refresh = () => {
    refetch();
  };
  const backToList = () => {
    navigate(rx.listUrl, {});
  };

  return (
    <>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && data && <RenderSchemaForm title={rx.title} schema={rx.schema} result={data} canEdit={rx.canEdit} onRefresh={refresh} goToList={backToList} />}
    </>
  );
};

///----------
interface RenderSchemaFormProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  result: IFormSchemaResult;
  canEdit: boolean;
  onRefresh: () => void;
  goToList: () => void;
}

const RenderSchemaForm: React.FC<RenderSchemaFormProps> = (rx) => {
  /* #region  vars */
  const { classes } = panelStyles();
  const [loading, setLoading] = useState(false);
  const [canEdit, setcanEdit] = useState<boolean>(rx.canEdit);
  const [tab, setTab] = useState<number>(0);
  const [current, setCurrent] = useState<PageInfo | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [valSchema, setValSchema] = useState({});
  const [pageData, setPageData] = useState<IFormSchemaField>(rx.result.schema.fields[tab]);
  const initVals = useMemo<Record<string, string>>(() => {
    if (rx.result.initialValues) return rx.result.initialValues;
    return {};
  }, [rx.result]);
  const [values, setValues] = useState<Record<string, string>>({});
  const entity = useMemo<IEntityState>(() => {
    return rx.result.entity;
  }, [rx.result]);
  const tabs = useMemo<Array<PageInfo>>(() => {
    const pages = rx.result.schema.fields.map((x) => ({ id: x.key, title: x.title, desc: x.description, state: 'INIT' } as PageInfo));
    return [...pages, { id: 'documents', title: 'Documents', desc: 'documents & links', state: 'INIT' }];
  }, [rx.result]);
  /* #endregion */

  /* #region  Effects */

  const getVal = (fd: IFormSchemaField, vs: any) => {
    buildYupObj(fd, vs);
    if (hasOwnProperty(initVals, fd.key)) {
      return `${initVals[fd.key]}`;
    }
    return '';
  };

  useEffect(() => {
    const vs = {};
    for (let i = 0; i < rx.result.schema.fields.length; i++) {
      const fdList = rx.result.schema.fields[i];
      setValues((cv) => {
        const newValues = fdList.fields.reduce((obj, fd) => {
          if (fd.layout === 2) {
            for (const sf of fd.fields) {
              obj[sf.key] = getVal(sf, vs);
            }
          } else {
            if (fd.layout === 0) obj[fd.key] = getVal(fd, vs);
          }
          return obj;
        }, {} as Record<string, string>);
        return Object.assign({}, newValues, cv);
      });
      //---loopend
      setValSchema(vs);
    }
  }, [rx]);

  useEffect(() => {
    if (tab < tabs.length - 1) {
      const newData = rx.result.schema.fields[tab];
      setPageData(newData);
      const cp = tabs[tab];
      cp.state = 'CURRENT';
      setCurrent(cp);
    }
  }, [tab, tabs]);


  useEffect(() => {
    console.log(values,"--");
  }, [values]);
  /* #endregion */

  /* #region  Events */

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
    //const changeSet = jpatch.compare(initVals, values);
    //console.log('cs', changeSet);
  };

  const onClickUpdate = async () => {
    const rs = validateForm();
    const isValid = Object.keys(rs).length > 0 ? false : true;
    if (current) current.state = !isValid ? 'ERROR' : 'SUCCESS';
    if (isValid) await execUpdate();
    else showNotification({ autoClose: 5000, title: 'Validation errors', message: 'Please fix all errors', color: 'red', icon: <AlertOctagon /> });
  };
  const onClickLock = () => {
    execAction(4, 'Lock entity');
  };
  const onClickUnlock = () => {
    execAction(5, 'UnLock entity');
  };
  const onClickDisable = () => {
    execAction(3, 'Disable entity');
  };
  const onClickEnable = () => {
    execAction(2, 'Enable entity');
  };
  const onClickDelete = () => {
    execAction(6, 'Delete entity');
  };

  /* #endregion */

  /* #region  Handlers */
  const ys = Yup.object().shape(valSchema);
  const validateForm = () => {
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

  // --- change state
  const execAction = async (action: number, reason: string) => {
    try {
      setLoading(true);
      if (entity.id) {
        const rs = await submitChangeForm(`${rx.schema}`, { id: entity.id, name: 'User Action', reason: reason, action: action });
        if (rs) {
          if (action === 6) rx.goToList();
          else rx.onRefresh();
        }
      }
    } finally {
      setLoading(false);
    }
  };
  // --- update
  const execUpdate = async () => {
    try {
      setLoading(true);
      const changeSet = jpatch.compare(initVals, values);
      if (Array.isArray(changeSet)) {
        const rs = await submiUpdateForm(rx.schema, entity.id, changeSet);
        if (rs) rx.onRefresh();
      }
    } finally {
      setLoading(false);
    }
  };
  /* #endregion */

  /* #region  Controls */

  const RenderButtons = () => {
    return (
      <PanelHeader
        title={entity.title}
        desc={rx.title}
        icon={rx.icon}
        renderStatus={() => {
          return (
            <>
              {!entity.disabled && (
                <Badge color="green" radius="md" variant="dot" size="xs">
                  Active
                </Badge>
              )}
              {entity.disabled && (
                <Badge color="gray" radius="md" variant="dot" size="xs">
                  Inactive
                </Badge>
              )}
              {entity.locked && (
                <Badge color="red" radius="md" variant="dot" size="xs">
                  Locked
                </Badge>
              )}
            </>
          );
        }}
        renderCmds={() => {
          return (
            <Group spacing={0} position="right">
              {!entity.disabled && !entity.locked && (
                <Button color="dotars" className={classes.vwbutton} onClick={onClickUpdate} compact disabled={!canEdit}>
                  Update
                </Button>
              )}

              {!entity.disabled && !entity.locked && (
                <Button variant="outline" color="dotars" className={classes.vwbutton} compact onClick={onClickLock} disabled={!canEdit}>
                  Lock
                </Button>
              )}
              {entity.locked === true && (
                <Button variant="outline" color="dotars" className={classes.vwbutton} compact onClick={onClickUnlock} disabled={!canEdit}>
                  Un-lock
                </Button>
              )}

              {!entity.disabled && !entity.locked && (
                <Button variant="outline" color="dotars" className={classes.vwbutton} compact onClick={onClickDisable} disabled={!canEdit}>
                  Disable
                </Button>
              )}
              {entity.disabled && (
                <Button variant="outline" className={classes.vwbutton} onClick={onClickEnable} compact disabled={!canEdit}>
                  Enable
                </Button>
              )}
              {!entity.disabled && !entity.locked && <ConfirmBtn color="red" className={classes.vwbutton} style={{ marginLeft: 10 }} compact OnOk={onClickDelete} disabled={!canEdit} btnTxt="Delete" confirmTxt="Are you sure you want to delete?" />}
            </Group>
          );
        }}
      />
    );
  };

  /* #endregion */

  return (
    <Card withBorder className={classes.Card}>
      <LoadingOverlay visible={loading} />
      <RenderButtons />
      <Card.Section className={classes.Content} style={{ paddingTop: 25 }}>
        <Tabs position="left" color="cyan" tabPadding="sm" active={tab}  
        onTabChange={setTab} style={{ fontWeight: 500, minHeight: 550 }}>
          {tabs &&
            tabs.length > 0 &&
            tabs.map((tb) => {
              return (
                <Tabs.Tab key={tb.title} label={tb.title} title={tb.desc} icon={<Bookmark size={16} />}>
                  {tab < tabs.length - 1 &&
                    pageData.fields.map((field) => {
                      switch (field.layout) {
                        case 2:
                          return <SchemaFieldGroup key={field.key} field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={entity.locked ||entity.disabled}/>;
                        case 4:
                          return <Divider  key={field.key} title={field.title} style={{ marginTop: 15 }} />;
                          case 5:
                            return <SubgridControl  key={field.key}  field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={entity.locked ||entity.disabled}/>;
                        default:
                          return <SchemaFieldFactory key={field.key} field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={entity.locked ||entity.disabled}/>;
                      }
                    })}
                </Tabs.Tab>
              );
            })}
        </Tabs>
      </Card.Section>
    </Card>
  );
};
