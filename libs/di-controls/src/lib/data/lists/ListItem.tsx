import { Badge, Group, Text } from '@mantine/core';
import { IEntity } from '@dotars/di-core';

export interface ListItemProps<T extends IEntity> {
  item: T;
  title: (item: T) => React.ReactNode;
  desc: (item: T) => React.ReactNode;
}
export const ListItem = <T extends IEntity>(rx: ListItemProps<T>) => {
  return (
    <>
      <Group>
        <Text size="sm" mb={3} sx={{ lineHeight: 1 }}>
          {rx.title(rx.item)}
        </Text>
        {rx.item.isDisabled && (
          <Badge color="red" size="xs">
            Inactive
          </Badge>
        )}
        {rx.item.isLocked && (
          <Badge color="indigo" size="xs">
            Locked
          </Badge>
        )}
      </Group>
      <Text size="xs" color="dimmed">
        {rx.desc(rx.item)}
      </Text>
    </>
  );
};
