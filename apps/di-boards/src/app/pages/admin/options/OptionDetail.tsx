import { EntityForm } from '@dotars/di-controls';
import { ICodeRecord } from '@dotars/di-core';
import { Grid, Textarea, TextInput } from '@mantine/core';

export const OptionDetail: React.FC = () => {
  const onSubmit = (value: ICodeRecord) => {
    console.log(value, value?.code);
  };
  const formData = {
    initialValues: {
      id: 0,
      name: '',
      description: '',
      code: '',
    },
    validate: {
      name: (value) => (value.length < 10 ? 'Name must have at least 10 letters' : null),
    },
  };
  return (
    <EntityForm
      stateUrl="/options/change"
      config={formData}
      submitData={onSubmit}
      renderForm={(form) => (
        <Grid justify="space-between">
          <Grid.Col span={6} style={{ minHeight: 280, padding: 5 }}>
            <TextInput label="Name" required placeholder="Option set name" {...form.getInputProps('name')} />
            <TextInput label="Code" variant="unstyled" disabled {...form.getInputProps('code')} />
          </Grid.Col>
          <Grid.Col span={6} style={{ minHeight: 280, padding: 5 }}>
            <Textarea label="Description" placeholder="Option set name" {...form.getInputProps('description')} autosize minRows={3} maxRows={6} />
          </Grid.Col>
        </Grid>
      )}
    />
  );
};
