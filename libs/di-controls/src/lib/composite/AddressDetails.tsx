import { Divider, Grid } from '@mantine/core';
import { TextField } from '../fields';
import { AddressProps } from './types';

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
