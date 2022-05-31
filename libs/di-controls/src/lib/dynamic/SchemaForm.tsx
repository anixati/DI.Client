import { getErrorMsg, IFormSchema } from '@dotars/di-core';
import { Alert, Avatar, Card, Group, LoadingOverlay } from '@mantine/core';
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Receipt } from 'tabler-icons-react';
import { PanelHeader } from '../controls';
import { panelStyles } from '../styles';
import { getSchemaData } from './api';

export interface ISchemaFormProps {
  title: string;
  icon?: ReactNode;
  schema: string;
}

export const SchemaForm: React.FC<ISchemaFormProps> = (rx) => {
  const queryClient = new QueryClient();
  const { isLoading, error, data, isSuccess } = useQuery([rx.schema], () => getSchemaData(rx.schema), { keepPreviousData: false, staleTime: Infinity });
  return (
    <QueryClientProvider client={queryClient}>
      <>
        {isLoading && <LoadingOverlay visible={true} />}
        {error && (
          <Alert title="Error!" color="red">
            {getErrorMsg(error)}{' '}
          </Alert>
        )}
        {isSuccess && <RenderSchemaForm title={rx.title} schemaKey={rx.schema} schema={data} />}
      </>
    </QueryClientProvider>
  );
};

interface RenderSchemaFormProps {
  title: string;
  icon?: ReactNode;

  schemaKey: string;
  schema: IFormSchema;
}
const RenderSchemaForm: React.FC<RenderSchemaFormProps> = (rx) => {
  const { classes } = panelStyles();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Card withBorder className={classes.Card}>
      <PanelHeader title={title} desc={rx.title} icon={rx.icon} />
    </Card>
  );
};
