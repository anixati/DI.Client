import { EntityForm, PageView, RenderList, SubCodeTable } from '@dotars/di-controls';
import { ICodeRecord, useEntityContext } from '@dotars/di-core';
import { Grid, NumberInput, Textarea, TextInput } from '@mantine/core';
import { UseFormInput, UseFormReturnType } from '@mantine/form/lib/use-form';
import { ReactNode } from 'react';
import { Column } from 'react-table';
import { Receipt } from 'tabler-icons-react';
import { OptionValue } from '../../../data';
import { appStyles } from '../../../Styles';

function renderForm(form: UseFormReturnType<ICodeRecord>): ReactNode {
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

function renderOptionValue(form: UseFormReturnType<OptionValue>): ReactNode {
  const { classes } = appStyles();
  return (
    <Grid justify="space-between" className={classes.grid}>
      <Grid.Col span={6} className={classes.firstGrid}>
        <TextInput label="label" required placeholder="Name" {...form.getInputProps('label')} />
        <NumberInput defaultValue={0} placeholder="Value" label="Value" required {...form.getInputProps('value')} />
      </Grid.Col>
      <Grid.Col span={6}>
        <NumberInput defaultValue={0} placeholder="Value" label="Order" {...form.getInputProps('order')} />
        <Textarea label="Description" placeholder="Description" {...form.getInputProps('description')} autosize minRows={3} maxRows={6} />
      </Grid.Col>
    </Grid>
  );
}

const OptionDetails: React.FC = () => {
  const ectx = useEntityContext();
  const columns: Array<Column<OptionValue>> = [
    {
      Header: 'Name',
      accessor: 'label',
      width: 150,
    },
    {
      Header: 'Value',
      accessor: 'value',
      minWidth: 240,
      width: 250,
    },
    {
      Header: 'Description',
      accessor: 'description',
      width: 250,
    },
  ];

  const okConfig = {
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
  const getConfig = (parentId: number): UseFormInput<OptionValue> => {
    return {
      initialValues: {
        optionId: parentId,
        id: 0,
        label: '',
        description: '',
        value: 0,
        order: 0,
      },
      validate: { label: (value: string) => (value.length < 10 ? 'Name must have at least 10 letters' : null), value: (val: number) => (val <= 0 ? 'value must be greater than 0' : null) },
    };
  };

  return (
    <EntityForm baseUrl="/options" config={okConfig} renderForm={renderForm} canLock={true}>
      {ectx && ectx.entity && <SubCodeTable<OptionValue> baseUrl="/optval" title="Optionset Values" columns={columns} 
        config={getConfig(ectx.entity.id)} renderForm={renderOptionValue} />}
    </EntityForm>
  );
};

export const OptionsPage: React.FC = () => {
  return (
    <PageView title="Optionset Management" desc="Manage application refrence data" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={4} style={{ minHeight: 280, padding: 5 }}>
          <RenderList url="/options" title="Option Sets" />
        </Grid.Col>
        <Grid.Col span={8} style={{ minHeight: 280, padding: 5 }}>
          <OptionDetails />
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
