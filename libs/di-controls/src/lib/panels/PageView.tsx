import { EntityCtxProvider } from '@dotars/di-core';
import { Avatar, Box, Card, Group, Text } from '@mantine/core';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PanelHeader } from '../controls';
import { panelStyles } from '../styles';
export interface IPageViewProps {
  title: string;
  icon?: ReactNode;
  desc: string;
  renderCmds?: () => ReactNode;
}
export const PageView: React.FC<IPageViewProps> = (rx) => {
  const { classes } = panelStyles();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <EntityCtxProvider>
        <Card withBorder className={classes.Card}>
          <PanelHeader title={rx.title} desc={rx.desc} icon={rx.icon} renderCmds={rx.renderCmds} />
          <Card.Section className={classes.Content}>{rx.children}</Card.Section>
        </Card>
      </EntityCtxProvider>
    </QueryClientProvider>
  );
};
