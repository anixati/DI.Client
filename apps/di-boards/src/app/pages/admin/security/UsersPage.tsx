import { AddressDetails, ContactDetails, DataForm, GenericList, PageView, RenderList, TextField, UserName } from '@dotars/di-controls';
import { IAppUser, NewUser, UserSchema } from '@dotars/di-core';
import { Container, Grid, Group, Tabs } from '@mantine/core';
import { FormikProps } from 'formik';
import { ReactNode } from 'react';
import { Receipt, User } from 'tabler-icons-react';

function rendeUserForm(form: FormikProps<IAppUser>, isNew: boolean): ReactNode {
  // const { classes } = appStyles();
  return (
    <Container fluid={true}>
      <Group position="left">
        <TextField name="userId" placeholder="User Id" label="User Id" desc="AD user id" required />
      </Group>
      <Tabs style={{ marginTop: 12 }} position="right">
        <Tabs.Tab label="Details" icon={<User size={14} />}>
          <UserName />
          <ContactDetails />
        </Tabs.Tab>
        <Tabs.Tab label="Adresses" icon={<User size={14} />}>
          <AddressDetails title="Street" code="streetAddress" />
          <AddressDetails title="Postal" code="postalAddress" />
        </Tabs.Tab>
        <Tabs.Tab label="Memberships" icon={<User size={14} />} disabled={isNew}>
          hsadsahd
        </Tabs.Tab>
      </Tabs>
    </Container>
  );
}

const UserDetails: React.FC = () => {
  //const ectx = useEntityContext();
  return <DataForm baseUrl="/users" canLock={false} initial={NewUser} schema={UserSchema} renderForm={rendeUserForm}></DataForm>;
};

export const UsersPage: React.FC = () => {
  const rndrTitle = (item: IAppUser) => {
    return item.firstName;
  };
  const rndrDesc = (item: IAppUser) => {
    return item.firstName;
  };

  const searchFn = (str: string) => {
    return function (v: IAppUser) {
      return v.lastName?.toLowerCase().includes(str) || v.firstName?.toLowerCase().includes(str) || str === '';
    };
  };

  return (
    <PageView title="User Management" desc="Manage application Users" icon={<Receipt />}>
      <Grid justify="space-between">
        <Grid.Col span={4} style={{ minHeight: 280, padding: 5 }}>
          <GenericList url="/users" title="Application Users" rndrTitle={rndrTitle} rndrDesc={rndrDesc} predicate={searchFn} />
        </Grid.Col>
        <Grid.Col span={8} style={{ minHeight: 280, padding: 5 }}>
          <UserDetails />
        </Grid.Col>
      </Grid>
    </PageView>
  );
};
