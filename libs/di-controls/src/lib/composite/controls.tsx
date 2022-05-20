import { Divider, Grid } from '@mantine/core';
import { TextField } from '../fields';
export interface CompositeProps {
  title?: string;
}

export const UserName: React.FC<CompositeProps> = (rx) => {
  return (
    <Grid grow gutter="xs">
      <Grid.Col md={3} lg={2}>
        <TextField name="title" placeholder="Title" label="Title" />
      </Grid.Col>
      <Grid.Col md={6} lg={4}>
        <TextField name="firstName" placeholder="First name" label="First Name" required />
      </Grid.Col>
      <Grid.Col md={6} lg={2}>
        <TextField name="middleName" placeholder="Middle name" label="Midddle Name" />
      </Grid.Col>
      <Grid.Col md={6} lg={4}>
        <TextField name="lastName" placeholder="Last name" label="Last Name" required />
      </Grid.Col>
    </Grid>
  );
};

export const ContactDetails: React.FC<CompositeProps> = (rx) => {
  return (
    
    <Grid grow gutter="xs">
      <Grid.Col md={6} lg={3}>
        <TextField name="homePhone" placeholder="Phone" label="Phone" />
      </Grid.Col>
      <Grid.Col md={6} lg={3}>
        <TextField name="mobilePhone" placeholder="Mobile" label="Mobile" />
      </Grid.Col>
      <Grid.Col md={6} lg={3}>
        <TextField name="email1" placeholder="Email" label="Primary Email" />
      </Grid.Col>
      <Grid.Col md={6} lg={3}>
        <TextField name="email2" placeholder="Email" label="Other Email" />
      </Grid.Col>
    </Grid>
  );
};

export interface AddressProps extends CompositeProps {
  code: string;
}
export const AddressDetails: React.FC<AddressProps> = (rx) => {
  return (
    <>
      <Divider my="xs" label={`${rx.title ? rx.title : ''} Address`} />
      <Grid grow gutter="xs">
        <Grid.Col md={2} lg={1}>
          <TextField name={`${rx.code}.unit`} placeholder="unit" label="Unit No" />
        </Grid.Col>
        <Grid.Col md={4} lg={4}>
          <TextField name={`${rx.code}.street`} placeholder="street" label="Street Name" />
        </Grid.Col>
        <Grid.Col md={4} lg={7}>
          <TextField name={`${rx.code}.city`} placeholder="city" label="Suburb/City" />
        </Grid.Col>
      </Grid>
      <Grid grow gutter="xs">
        <Grid.Col md={4} lg={4}>
          <TextField name={`${rx.code}.postcode`} placeholder="Post Code" label="Post Code" />
        </Grid.Col>
        <Grid.Col md={4} lg={4}>
          <TextField name={`${rx.code}.state`} placeholder="State" label="State" />
        </Grid.Col>
        <Grid.Col md={4} lg={4}>
          <TextField name={`${rx.code}.country`} placeholder="Country" label="Country" />
        </Grid.Col>
      </Grid>
    </>
  );
};
