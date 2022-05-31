import { Avatar, Card, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { panelStyles } from '../styles';

export interface PanelHeaderProps {
  title: string;
  icon?: ReactNode;
  desc: string;
  renderCmds?: () => ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = (rx) => {
  const { classes } = panelStyles();
  return (
    <Card.Section className={classes.Header}>
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
            size={45}
          >
            {rx.icon}
          </Avatar>
          <div>
            <Text size="sm" color="dotars" weight={500}>
              {rx.title}
            </Text>
            <Text color="dimmed" size="xs">
              {rx.desc}
            </Text>
          </div>
        </Group>
        <Group position="right" spacing={3}>
          {rx.renderCmds && rx.renderCmds()}
        </Group>
      </Group>
    </Card.Section>
  );
};
