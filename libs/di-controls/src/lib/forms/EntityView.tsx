import { INamedRecord, useEntityContext } from '@dotars/di-core';
import { Avatar, Card, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { File, FilePlus } from 'tabler-icons-react';
import { dataUiStyles } from '../styles/Styles';

export interface EntityViewProps {
  name: string;
  toolBar?: ReactNode;
}

export const EntityView: React.FC<EntityViewProps> = (rx) => {
  const { classes } = dataUiStyles();
  const ectx = useEntityContext();
  const isNew = ectx?.entity !== undefined;
  return (
    <Card withBorder p="lg" className={classes.entityView}>
      <Card.Section className={classes.cardHeader}>
        <Group spacing="sm" position="apart">
          <Group spacing="sm" position="left">
            <Avatar
              styles={{
                root: { color: '#071E3E' },
                image: { color: '#071E3E' },
                placeholder: { color: '#071E3E' },
                placeholderIcon: { color: '#071E3E' },
              }}
              radius="sm"
              size={30}
            >
              {isNew && <File size={30} />}
              {!isNew && <FilePlus size={30} />}
            </Avatar>
            <div>
              <Text size="sm" weight={500}>
                <div>
                  {ectx?.entity === undefined && `New ${rx.name}`}
                  {ectx?.entity && (ectx.entity as INamedRecord) && `${(ectx.entity as INamedRecord).name}`}
                </div>
              </Text>
            </div>
          </Group>
          {rx.toolBar && rx.toolBar}
        </Group>
      </Card.Section>
      <Card.Section className={classes.cardContent}>{rx.children}</Card.Section>
    </Card>
  );
};
