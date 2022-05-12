import { EntityCtxProvider, IViewProps } from '@dotars/di-core';
import { Avatar, Card, Container, Group, Text } from '@mantine/core';
import { panelStyles } from './Styles';


export const PageView: React.FC<IViewProps> = (rx) => {
  const { classes } = panelStyles();
  return (
    <EntityCtxProvider>
      <Card withBorder p="lg" className={classes.card}>
        <Card.Section className={classes.header}>
          <Group spacing="sm">
            <Avatar color="#071E3E" radius="sm" size={45}>
             {rx.icon}
            </Avatar>
            <div>
              <Text size="sm" weight={500}>
                {rx.title}
              </Text>
              <Text color="dimmed" size="xs">
                {rx.desc}
              </Text>
            </div>
          </Group>
        </Card.Section>
        <Card.Section className={classes.content}>
          <Container fluid={true}>{rx.children}</Container>
        </Card.Section>
      </Card>
    </EntityCtxProvider>
  );
};



