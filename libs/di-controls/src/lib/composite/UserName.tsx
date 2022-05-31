import { Grid } from '@mantine/core';
import { TextField } from '../fields';
import { CompositeProps } from './types';


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
