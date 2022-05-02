import { EntityForm, PageView, RenderList, SubCodeTable } from '@dotars/di-controls';
import { ICodeRecord } from '@dotars/di-core';
import { Grid, Textarea, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { ReactNode } from 'react';
import { Column } from 'react-table';
import { Receipt } from 'tabler-icons-react';
import { OptionValue } from '../../data';
import { appStyles } from '../../Styles';

function renderForm(form: UseFormReturnType<ICodeRecord>): ReactNode {
  const { classes, cx } = appStyles();
  return (
    <Grid justify="space-between" className={classes.grid}>
      <Grid.Col span={6}  className={classes.firstGrid}>
        <TextInput label="Name" required placeholder="Option set name" {...form.getInputProps('name')} />
        <TextInput label="Code" variant="unstyled" disabled {...form.getInputProps('code')} />
      </Grid.Col>
      <Grid.Col span={6}>
        <Textarea label="Description" placeholder="Option set name" {...form.getInputProps('description')} autosize minRows={3} maxRows={6} />
      </Grid.Col>
    </Grid>
  );
}

export const OptionsPage: React.FC = () => {
  const formData = {
    initialValues: {
      id: 0,
      name: '',
      description: '',
      code: '',
    },
    validate: {
      name: (value: string) => (value.length < 10 ? 'Name must have at least 10 letters' : null),
    },
  };


  const columns: Array<Column<OptionValue>> = [
    {
      Header: 'Name',
      accessor: 'label',
    },
    {
      Header: 'Value',
      accessor: 'value',
    },
    {
      Header: 'Description',
      accessor: 'description',
    },
  ]




  return (
    <PageView title="Optionset Management" desc="Manage optionset's" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={4} style={{ minHeight: 280, padding: 5 }}>
          <RenderList url="/options" title="Option Sets" />
        </Grid.Col>
        <Grid.Col span={8} style={{ minHeight: 280, padding: 5 }}>
          <EntityForm baseUrl="/options" config={formData} renderForm={renderForm}>
           <SubCodeTable baseUrl="/optval" title="Optionset Values"  columns={columns}/>
          </EntityForm>
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
