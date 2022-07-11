import { useAppContext } from '@dotars/di-core';
import { ActionIcon, Avatar, Button, Card, Group, Text } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { ReactNode } from 'react';
import { useNavigate, useNavigationType } from 'react-router-dom';
import { ArrowAutofitLeft, ArrowAutofitRight, ArrowLeft, AspectRatio, Maximize, MaximizeOff } from 'tabler-icons-react';
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
  const  ct = useNavigationType();
  const { navClose, showNav } = useAppContext();
  const { toggle, fullscreen } = useFullscreen();
  
  return (
    <Card.Section className={classes.Header}>
      <Group spacing={0} position="apart">
        <Group spacing={0} position="left">
          <ActionIcon
            size="lg"
            variant="hover"
            color="cyan"
            onClick={() => {
              if (showNav) showNav(!navClose);
            }}
          >
           {navClose && <ArrowAutofitLeft />}
           {!navClose && <ArrowAutofitRight />}
          </ActionIcon>
          <ActionIcon
            size="lg"
            variant="hover"
            color="cyan"
            onClick={() => {
              navigate(-1);
            }}
           // disabled={ct === "POP" }
          >
            <ArrowLeft />
          </ActionIcon>
          <div style={{ marginLeft: 10 }}>
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
        <Group position="right" spacing={5}>
          {rx.renderCmds && rx.renderCmds()} 
          <ActionIcon
            size="lg"
            variant="hover"
            color="cyan"
            onClick={() => {
              toggle();
            }}
          >
           {!fullscreen && <Maximize />}
           {fullscreen && <MaximizeOff />}
          </ActionIcon>
        </Group>
      </Group>
    </Card.Section>
  );
};
function useHistory() {
  throw new Error('Function not implemented.');
}
