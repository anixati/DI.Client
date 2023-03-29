import { ISelectedItem } from '@dotars/di-core';
import { Anchor, Divider, Group, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ISchemaFieldProps } from './SchemaFieldFactory';

export const LinkControl = (rx: ISchemaFieldProps) => {
  const { field, values } = rx;
  const [select] = useState<ISelectedItem | undefined>(() => {
    if (values) {
      const fv = values[field.key];
      if (fv) {
        const sf = JSON.parse(fv) as ISelectedItem;
        if (sf) return sf;
      }
    }
    return undefined;
  });
  return (
    <Group sx={{ backgroundColor:'#F1F3F5',paddinglEFT:5 }}>
      <Stack justify="flex-start" spacing={0}>
        <Group position="right" p={0} m={0}>
          <Text size="sm" color="dotars" weight={600}>
            {field.title}
          </Text>
        </Group>
        <Group mt={-2} pl={5}>
          {select?.label && (
            <Anchor component={Link} to={`${field.options}/${select.value}`} size="sm">
              {select.label}
            </Anchor>
          )}
        </Group>
      </Stack>
      <Divider sx={{ height: '50px',color:'cyan' }} color="cyan"  size="xl" orientation="vertical" />
    </Group>
  );
};

export const LabelControl = (rx: ISchemaFieldProps) => {
  const { field, values } = rx;

  return (
    <Group>
      <div style={{ marginLeft: 10 }}>
        <Text size="sm" color="dotars" weight={600}>
          {field.title}
        </Text>
        <Text size="xs" color="dotars" weight={400} sx={{ marginLeft: 5 }}>
          {values[field.key] ? values[field.key] : ''}
        </Text>
      </div>
      <Divider sx={{ height: '50px' }} size="sm" orientation="vertical" />
    </Group>
  );
};
