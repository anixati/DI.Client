import { Grid } from '@mantine/core';
import { TextField } from '../fields';
import { CompositeProps } from './types';


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
