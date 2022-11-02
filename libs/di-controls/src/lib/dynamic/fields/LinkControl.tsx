import { ISelectedItem } from '@dotars/di-core';
import { Anchor, Divider, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ISchemaFieldProps } from './SchemaFieldFactory';

export const LinkControl = (rx: ISchemaFieldProps) => {
  const { field } = rx;
  const [select, setSelect] = useState<ISelectedItem | undefined>(() => {
    const sf = JSON.parse(field.value) as ISelectedItem;
    if (sf) return sf;
    return undefined;
  });

  return (
    <Group>
      <div style={{ marginLeft: 10 }}>
        <Text size="sm" color="dotars" weight={600}>
          {field.title}
        </Text>
        <Group>
          {select?.label && (
            <Anchor component={Link} to={`${field.options}/${select.value}`} size="xs">
              {select.label}
            </Anchor>
          )}
        </Group>
      </div>
      <Divider sx={{ height: '50px' }} size="sm" orientation="vertical" />
    </Group>
  );
};




export const LabelControl = (rx: ISchemaFieldProps) => {
  const { field,  values } = rx;


  return (
    <Group>
      <div style={{ marginLeft: 10 }}>
        <Text size="sm" color="dotars" weight={600}>
          {field.title}
        </Text>
        <Text size="xs" color="dotars" weight={400} sx={{marginLeft:5}}>
          {values[field.key] ? values[field.key] : ''}
        </Text>
      </div>
      <Divider sx={{ height: '50px' }} size="sm" orientation="vertical" />
    </Group>
  );
};
