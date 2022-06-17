import { ActionIcon, Avatar, Button, Card, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowAutofitLeft, ArrowLeft } from 'tabler-icons-react';
import { panelStyles } from '../styles';

export interface PanelHeaderProps {
  title: string;
  icon?: ReactNode;
  desc?: string;
  renderStatus?: () => ReactNode;
  renderCmds?: () => ReactNode;
}

export const PanelHeader: React.FC<PanelHeaderProps> = (rx) => {
  const { classes } = panelStyles();
  const navigate = useNavigate();

  return (
    <Card.Section className={classes.Header}>
      <Group spacing="sm" position="apart">
        <Group spacing={0} position="left">
          <ActionIcon size="xl" variant="hover" color="cyan" onClick={()=>{navigate(-1)}}>
            <ArrowLeft />
          </ActionIcon>
          {/* <Avatar
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
          </Avatar> */}
          <div style={{marginLeft:10}}>
            <Text size="sm" color="dotars" weight={500}>
              {rx.title}
            </Text>
            <Group>
              <Text color="dimmed" size="xs">
                {rx.desc}
              </Text>
              {rx.renderStatus && rx.renderStatus()}
            </Group>
          </div>
        </Group>
        <Group position="right" spacing={3}>
          {rx.renderCmds && rx.renderCmds()}
        </Group>
      </Group>
    </Card.Section>
  );
};
function useHistory() {
  throw new Error('Function not implemented.');
}

