import { EntityForm, PageView, RenderList } from "@dotars/di-controls";
import { ICodeRecord, useEntityContext } from "@dotars/di-core";
import { Grid, Textarea, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form/lib/use-form";
import { ReactNode } from "react";
import { Receipt } from "tabler-icons-react";
import { appStyles } from "../../../Styles";



function rendeTeamForm(form: UseFormReturnType<ICodeRecord>): ReactNode {
  const { classes } = appStyles();
  return (
    <Grid justify="space-between" className={classes.grid}>
      <Grid.Col span={6} className={classes.firstGrid}>
        <TextInput label="Portfolio Name" required placeholder="Portfolio name" {...form.getInputProps('name')} />
        <TextInput label="Code" variant="unstyled" disabled {...form.getInputProps('code')} />
      </Grid.Col>
      <Grid.Col span={6}>
        <Textarea label="Portfolio Description" placeholder="Portfolio description" {...form.getInputProps('description')} autosize minRows={3} maxRows={6} />
      </Grid.Col>
    </Grid>
  );
}

const PortfolioDetails: React.FC = () => {
  const ectx = useEntityContext();
  const config = {
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
  return <EntityForm baseUrl="/portfolios" config={config} renderForm={rendeTeamForm} canLock={true}></EntityForm>;
};

export const PortfolioPage: React.FC = () => {
  return (
    <PageView title="Portfolio Management" desc="Manage Portfolios" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={4} style={{ minHeight: 280, padding: 5 }}>
          <RenderList url="/portfolios" title="Portfolios" />
        </Grid.Col>
        <Grid.Col span={8} style={{ minHeight: 280, padding: 5 }}>
          <PortfolioDetails />
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
