import { getErrorMsg, IEntityState, IFormSchemaField, IFormSchemaResult } from '@dotars/di-core';
import { Alert, Card, LoadingOverlay, Tabs } from '@mantine/core';
import { hasOwnProperty } from 'fast-json-patch/module/helpers';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { AspectRatio } from 'tabler-icons-react';
import { PanelHeader } from '../controls';
import { panelStyles } from '../styles';
import { getViewSchemaData } from './api';
import { PageInfo } from './Context';
import { SchemaFieldFactory } from './SchemaFieldFactory';
import { SchemaFieldGroup } from './SchemaFieldGroup';
import * as jpatch from 'fast-json-patch';

export interface ISchemaFormProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  entityId?: string;
}

export const SchemaForm: React.FC<ISchemaFormProps> = (rx) => {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{rx.entityId && <SchemaFormView title={rx.title} schema={rx.schema} icon={rx.icon} entityId={rx.entityId} />}</QueryClientProvider>;
};
export interface ISchemaFormViewProps {
  title: string;
  icon?: ReactNode;
  schema: string;
  entityId: string;
}

export const SchemaFormView: React.FC<ISchemaFormViewProps> = (rx) => {
  const { isLoading, error, data, isSuccess } = useQuery([rx.schema], () => getViewSchemaData(rx.schema, rx.entityId), { keepPreviousData: false, staleTime: Infinity });
  return (
    <>
      {isLoading && <LoadingOverlay visible={true} />}
      {error && (
        <Alert title="Error!" color="red">
          {getErrorMsg(error)}{' '}
        </Alert>
      )}
      {isSuccess && <RenderSchemaForm title={rx.title} schemaKey={rx.schema} result={data} />}
    </>
  );
};

///----------
interface RenderSchemaFormProps {
  title: string;
  icon?: ReactNode;
  schemaKey: string;
  result: IFormSchemaResult;
}
const RenderSchemaForm: React.FC<RenderSchemaFormProps> = (rx) => {
  const { classes } = panelStyles();
  const [tab, setTab] = useState<number>(0);
  
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

  const getVal = (fd: IFormSchemaField, vs: any) => {
    if (hasOwnProperty(initVals, fd.key)) {return `${initVals[fd.key]}`};
    return '';
  };


  useEffect(() => {
    if (tab < tabs.length - 1) {
      const newData = rx.result.schema.fields[tab];
      const vs = {};
      setPageData(newData);
      // setValues((cv) => {
      //   const newValues = newData.fields.reduce((obj, fd) => {
      //     if (fd.layout === 2) {
      //       for (const sf of fd.fields) {
      //         obj[sf.key] = getVal(sf, vs);
      //       }
      //     } else {
      //       obj[fd.key] = getVal(fd, vs);
      //     }
      //     return obj;
      //   }, {} as Record<string, any>);
      //   //setValSchema(_valSchema);
      //   return Object.assign({}, newValues, cv);
      // });
      const cp = tabs[tab];
      cp.state = 'CURRENT';
      // setCurrent(cp);

    }
  }, [tab, tabs]);

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
    console.log('cs',changeSet);
  };

  const [loading, setLoading] = useState(false);

  return (
    <Card withBorder className={classes.Card}>
      <PanelHeader
        title={entity.title}
        desc={rx.title}
        icon={rx.icon}
        renderCmds={() => {
          return <>.</>;
        }}
      />
      <Card.Section className={classes.Content}>
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
