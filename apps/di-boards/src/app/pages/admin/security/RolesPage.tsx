import { EntityForm, PageView, RenderList } from '@dotars/di-controls';
import { ICodeRecord, useEntityContext } from '@dotars/di-core';
import { Grid, Textarea, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { ReactNode } from 'react';
import { Receipt } from 'tabler-icons-react';
import { appStyles } from '../../../Styles';

function rendeRoleForm(form: UseFormReturnType<ICodeRecord>): ReactNode {
  const { classes } = appStyles();
  return (
    <Grid justify="space-between" className={classes.grid}>
      <Grid.Col span={6} className={classes.firstGrid}>
        <TextInput label="Name" required placeholder="Option set name" {...form.getInputProps('name')} />
        <TextInput label="Code" variant="unstyled" disabled {...form.getInputProps('code')} />
      </Grid.Col>
      <Grid.Col span={6}>
        <Textarea label="Description" placeholder="Description" {...form.getInputProps('description')} autosize minRows={3} maxRows={6} />
      </Grid.Col>
    </Grid>
  );
}

const RoleDetails: React.FC = () => {
  const ectx = useEntityContext();
  const roleConfig = {
    initialValues: {
      id: 0,
      name: '',
      description: '',
      code: '',
    },
    validate: {
      name: (value: string) => (value.length < 5 ? 'Name must have at least 5 letters' : null),
    },
  };
  return <EntityForm baseUrl="/roles" config={roleConfig} renderForm={rendeRoleForm} canLock={false}></EntityForm>;
};

export const RolesPage: React.FC = () => {
  return (
    <PageView title="Role Management" desc="Manage application roles" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={4} style={{ minHeight: 280, padding: 5 }}>
          <RenderList url="/roles" title="Application Roles" />
        </Grid.Col>
        <Grid.Col span={8} style={{ minHeight: 280, padding: 5 }}>
          <RoleDetails />
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
