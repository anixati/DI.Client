import { getErrorMsg, IEntityState, IFormSchemaField, IFormSchemaResult } from '@dotars/di-core';
import { Alert, Button, Card, Group, LoadingOverlay, Tabs } from '@mantine/core';
import * as jpatch from 'fast-json-patch';
import { hasOwnProperty } from 'fast-json-patch/module/helpers';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { AspectRatio } from 'tabler-icons-react';
import { ConfirmBtn, PanelHeader } from '../controls';
import { panelStyles } from '../styles';
import { getViewSchemaData, submitChangeForm, submiUpdateForm } from './api';
import { PageInfo } from './Context';
import { SchemaFieldFactory } from './SchemaFieldFactory';
import { SchemaFieldGroup } from './SchemaFieldGroup';
import { buildYupObj } from './Validation';

export interface ISchemaFormProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  entityId?: string;
  canEdit: boolean;
}

export const SchemaForm: React.FC<ISchemaFormProps> = (rx) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{rx.entityId && <SchemaFormView canEdit={rx.canEdit} title={rx.title} schema={rx.schema} icon={rx.icon} entityId={rx.entityId} />}</QueryClientProvider>;
};
export interface ISchemaFormViewProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  entityId: string;
  canEdit: boolean;
}

const SchemaFormView: React.FC<ISchemaFormViewProps> = (rx) => {
  const viewSchema = useMemo<string>(() => `view_${rx.schema}`, [rx]);
  const { isLoading, error, data, isSuccess } = useQuery([viewSchema], () => getViewSchemaData(viewSchema, rx.entityId), { keepPreviousData: false, staleTime: Infinity });
  return (
    <>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && data && <RenderSchemaForm title={rx.title} schema={rx.schema} result={data} canEdit={rx.canEdit} />}
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
            obj[fd.key] = getVal(fd, vs);
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

    const changeSet = jpatch.compare(initVals, values);
    console.log('cs', changeSet);
  };

  const onClickUpdate = async () => {
    await execUpdate();
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
  const execAction = async (action: number, reason: string) => {
    try {
      setLoading(true);
      if (entity.id) {
        await submitChangeForm(`${rx.schema}`, { id: entity.id, name: 'User Action', reason: reason, action: action });
      }
    } finally {
      setLoading(false);
    }
  };

  const execUpdate = async () => {
    try {
      setLoading(true);
      if (entity.id) {
        await submiUpdateForm(`${rx.schema}`,entity.id);
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
              {!entity.disabled && !entity.locked && <ConfirmBtn color="red" className={classes.vwbutton} style={{marginLeft:10}}
              compact OnConfirm={onClickDelete} disabled={!canEdit} btnTxt="Delete" confirmTxt="Are you sure you want to delete?" />}
             
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
      <Card.Section className={classes.Content} style={{paddingTop:50}}>
        <Tabs position="right" color="indigo" tabPadding="sm" active={tab} onTabChange={setTab} style={{ fontWeight: 500, minHeight: 550 }}>
          {tabs &&
            tabs.length > 0 &&
            tabs.map((tb) => {
              return (
                <Tabs.Tab key={tb.title} label={tb.title} title={tb.desc} icon={<AspectRatio />}>
                  {tab < tabs.length - 1 &&
                    pageData.fields.map((field) => {
                      switch (field.layout) {
                        case 2:
                          return <SchemaFieldGroup key={field.key} field={field} fieldChanged={onFieldChange} values={values} />;
                        default:
                          return <SchemaFieldFactory key={field.key} field={field} fieldChanged={onFieldChange} values={values} />;
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
