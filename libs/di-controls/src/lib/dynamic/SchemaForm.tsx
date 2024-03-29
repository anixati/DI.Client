import { CmdAcl, getErrorMsg, IEntityState, IFormAction, IFormSchemaField } from '@dotars/di-core';
import { Avatar, Badge, Button, Divider, Group, LoadingOverlay, Notification, Tabs, Text, Tooltip } from '@mantine/core';
import * as jpatch from 'fast-json-patch';
import { hasOwnProperty } from 'fast-json-patch/module/helpers';
import { yupToFormErrors } from 'formik';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Bookmark, FileDescription } from 'tabler-icons-react';
import * as Yup from 'yup';
import { ConfirmBtn, PanelHeader, ShowError, ShowWarn } from '../controls';
import { panelStyles } from '../styles';
import { ActionFormBtn } from './ActionFormBtn';
import { getViewSchemaData, submitChangeForm, submiUpdateForm } from './api';
import { PageInfo } from './Context';
import { HeaderFieldFactory } from './fields/HeaderFieldFactory';
import { SchemaFieldGroup, SchemaFieldItem } from './fields/SchemaFieldGroup';
import { SubgridControl } from './fields/Subgrid';
import { buildYupObj } from './Validation';

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

const getAcl = (acl: number) => {
  return Object.values(CmdAcl)
    .filter((v) => typeof v === 'number' && (acl & v) !== 0)
    .map((v) => CmdAcl[v as number]);
};

const SchemaFormView: React.FC<ISchemaFormViewProps> = (rx) => {
  const navigate = useNavigate();

  const viewSchema = useMemo<string>(() => `${rx.schema}`, [rx]);
  const [KeyName, SetKeyName] = useState(rx.schema);
  //const [InitVals, SetInitVals] = useState<Record<string,string>|undefined>(undefined);

  const { isLoading, error, data, isSuccess, refetch } = useQuery([viewSchema], () => getViewSchemaData(viewSchema, rx.entityId), { keepPreviousData: false, staleTime: 0 });
  const refresh = () => {
    //SetInitVals(undefined);
    SetKeyName(`${rx.schema}${Math.random()}`);
    refetch();
  };
  const backToList = () => {
    navigate(rx.listUrl, {});
  };
  useEffect(() => {
    refetch();
  }, [rx.entityId]);

  // useEffect(() => {
  //   SetInitVals(data?.initialValues)
  // }, [data]);

  if (isLoading) return <Notification loading title="Loading schema. please wait ..." disallowClose></Notification>;

  if (error)
    return (
      <Notification title="Failed loading site data" disallowClose>
        <Group position="left">
          <AlertCircle size={32} color="red" />
          <Text color="red" size="lg">
            {getErrorMsg(error)}
          </Text>
        </Group>
      </Notification>
    );
  if (isSuccess && data) {
    return <RenderSchemaForm key={KeyName} title={rx.title} schema={rx.schema} acl={getAcl(data.entity.cmdAcl)} actions={data.schema.actions} tabs={data.schema.fields.filter((x) => x.layout === 3)} headers={data.schema.fields.filter((x) => x.layout === 6)} entity={data.entity} initialValues={data.initialValues} hdrValues={data.hdrValues} canEdit={rx.canEdit} onRefresh={refresh} goToList={backToList} />;
  }

  return <>.</>;
};

///----------
interface RenderSchemaFormProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  entity: IEntityState;
  // result: IFormSchemaResult;
  canEdit: boolean;
  tabs: IFormSchemaField[];
  headers: IFormSchemaField[];
  actions?: IFormAction[];
  initialValues?: Record<string, string>;
  hdrValues?: Record<string, string>;
  onRefresh: () => void;
  goToList: () => void;
  acl: Array<string>;
}

const RenderSchemaForm: React.FC<RenderSchemaFormProps> = (rx) => {
  /* #region  vars */
  const { classes } = panelStyles();
  const [loading, setLoading] = useState(false);
  const [canEdit] = useState<boolean>(rx.canEdit);
  const [tab, setTab] = useState<number>(0);
  const [current, setCurrent] = useState<PageInfo | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [valSchema, setValSchema] = useState({});

  const [, setPageData] = useState<IFormSchemaField>(() => {
    return rx.tabs[tab];
  });
  // const initVals = useMemo<Record<string, string>>(() => {
  //   if (rx.initialValues) return rx.initialValues;
  //   return {};
  // }, [rx]);
  const [values, setValues] = useState<Record<string, string>>({});

  const entity = useMemo<IEntityState>(() => {
    return rx.entity;
  }, [rx]);

  const tabs = useMemo<Array<PageInfo>>(() => {
    const pages = rx.tabs.map((x) => ({ id: x.key, title: x.title, desc: x.description, state: 'INIT' } as PageInfo));
    return [...pages];
  }, [rx]);
  /* #endregion */

  /* #region  Effects */

  useEffect(() => {
    const vs = {};
    //---loopend
    setValSchema(vs);
    setValues({});

    const getVal = (fd: IFormSchemaField, vs: any) => {
      buildYupObj(fd, vs);
      if (rx.initialValues && hasOwnProperty(rx.initialValues, fd.key)) {
        return `${rx.initialValues[fd.key]}`;
      }
      return '';
    };
    for (let i = 0; i < rx.tabs.length; i++) {
      const fdList = rx.tabs[i];
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
      const newData = rx.tabs[tab];
      setPageData(newData);
      const cp = tabs[tab];
      cp.state = 'CURRENT';
      setCurrent(cp);
    }
  }, [tab, tabs]);

  // useEffect(() => {
  // }, [values]);

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
  };

  const onClickUpdate = async () => {
    const rs = validateForm();
    const isValid = Object.keys(rs).length > 0 ? false : true;
    if (current) current.state = !isValid ? 'ERROR' : 'SUCCESS';
    if (isValid) await execUpdate();
    else ShowError('Validation errors', 'Please fix all errors');
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
      const changeSet = jpatch.compare(rx.initialValues ? rx.initialValues : {}, values);
      if (Array.isArray(changeSet)) {
        if (changeSet.length > 0) {
          setLoading(true);
          const rs = await submiUpdateForm(rx.schema, entity.id, changeSet);
          if (rs) rx.onRefresh();
        } else {
          ShowWarn('No Change', 'No changes detected to update');
        }
      }
    } finally {
      setLoading(false);
    }
  };
  /* #endregion */

  /* #region  Controls */

  const RenderStatus = () => {
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
  };

  const onDialogClose = () => {
    console.log('refreshing closed');
    rx.onRefresh();
  };

  const RenderButtons = () => {
    return (
      <PanelHeader
        title={rx.title}
        renderCmds={() => {
          return (
            <>
              {/* // {(rx.acl & CmdAcl.Dialog) && ( */}
              <Group spacing={0} position="right">
                {rx.actions &&
                  rx.actions.length > 0 &&
                  rx.actions
                    .filter((x) => x.visible === true)
                    .map((fd) => {
                      return (
                        <Tooltip label={fd.description}>
                          <ActionFormBtn title={fd.label} schema={fd.schema} action="dialog" onClose={onDialogClose} size="50%" />
                        </Tooltip>
                      );
                    })}
              </Group>
              {/* )} */}
              <Group spacing={0} position="right">
                {!entity.disabled && !entity.locked && rx.acl.some((x) => x === CmdAcl[CmdAcl.Update]) && (
                  <Button color="dotars" className={classes.vwbutton} onClick={onClickUpdate} compact disabled={!canEdit}>
                    Update
                  </Button>
                )}

                {!entity.disabled && !entity.locked && rx.acl.some((x) => x === CmdAcl[CmdAcl.Lock]) && (
                  <Button variant="outline" color="dotars" className={classes.vwbutton} compact onClick={onClickLock} disabled={!canEdit}>
                    Lock
                  </Button>
                )}
                {entity.locked === true && rx.acl.some((x) => x === CmdAcl[CmdAcl.UnLock]) && (
                  <Button variant="outline" color="dotars" className={classes.vwbutton} compact onClick={onClickUnlock} disabled={!canEdit}>
                    Un-lock
                  </Button>
                )}

                {!entity.disabled && !entity.locked && rx.acl.some((x) => x === CmdAcl[CmdAcl.Disable]) && (
                  <Button variant="outline" color="dotars" className={classes.vwbutton} compact onClick={onClickDisable} disabled={!canEdit}>
                    Disable
                  </Button>
                )}
                {entity.disabled && rx.acl.some((x) => x === CmdAcl[CmdAcl.Enable]) && (
                  <Button variant="outline" className={classes.vwbutton} onClick={onClickEnable} compact disabled={!canEdit}>
                    Enable
                  </Button>
                )}
                {!entity.disabled && !entity.locked && rx.acl.some((x) => x === CmdAcl[CmdAcl.Delete]) && <ConfirmBtn color="red" className={classes.vwbutton} style={{ marginLeft: 10 }} compact OnOk={onClickDelete} disabled={!canEdit} btnTxt="Delete" confirmTxt="Are you sure you want to delete?" />}
              </Group>
            </>
          );
        }}
      />
    );
  };

  const RenderHeaders = () => {
    return (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>
        {rx.headers &&
          rx.headers.length > 0 &&
          rx.headers[0].fields.map((fd) => {
            return <HeaderFieldFactory key={fd.key} field={fd} fieldChanged={onFieldChange} values={rx.hdrValues ? rx.hdrValues : {}} errors={errors} disabled={true} />;
          })}
      </>
    );
  };

  /* #endregion */

  return (
    <div>
      <LoadingOverlay visible={loading} />
      <RenderButtons />
      <div className={classes.FormHeader}>
        <Group pl={20} position="apart">
          <Group spacing={0} position="left">
            <Avatar radius="sm" size={45}>
              <FileDescription />
            </Avatar>{' '}
            <div style={{ marginLeft: 10 }}>
              <Text size="sm" color="dotars" weight={500}>
                {entity.title}
              </Text>
              <Group>
                <RenderStatus />
              </Group>
            </div>
          </Group>
          <Group spacing={0} position="right">
            {rx.headers && <RenderHeaders />}
          </Group>
        </Group>
      </div>
      <div className={classes.Content}>
        <Tabs position="left" color="cyan" tabPadding={5} active={tab} onTabChange={setTab} style={{ fontWeight: 500, minHeight: 550 }}>
          {tabs &&
            tabs.length > 0 &&
            tabs.map((tb) => {
              return (
                <Tabs.Tab key={tb.title} label={tb.title} title={tb.desc} icon={<Bookmark size={16} />}>
                  <div className={classes.TabPane}>
                    {tab < tabs.length &&
                      rx.tabs[tab].fields.map((field) => {
                        switch (field.layout) {
                          case 2:
                            return <SchemaFieldGroup key={field.key} field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={entity.locked || entity.disabled} />;
                          case 4:
                            return <Divider key={field.key} label={field.title} style={{ marginTop: 15 }} />;
                          case 5:
                            return <SubgridControl key={field.key} field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={entity.locked || entity.disabled} />;
                          default:
                            return <SchemaFieldItem key={field.key} field={field} fieldChanged={onFieldChange} values={values} errors={errors} disabled={entity.locked || entity.disabled} />;
                        }
                      })}
                  </div>
                </Tabs.Tab>
              );
            })}
        </Tabs>
      </div>
    </div>
  );
};
