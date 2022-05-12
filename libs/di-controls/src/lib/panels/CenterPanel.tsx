import { Card, Center, Group, Text, useMantineTheme } from '@mantine/core';

export interface CenterPanelProps {
  title: string;
  desc: string;
}

export const CenterPanel: React.FC<CenterPanelProps> = (rx) => {
  const theme = useMantineTheme();
  const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];
  return (
    <div style={{ width: 440, margin: 'auto' }}>
      <Card shadow="sm" p="lg">
        <Card.Section></Card.Section>
        <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
          <Text size="xl">{rx.title}</Text>
        </Group>
        <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
          {rx.desc}
        </Text>
        <Center>{rx.children}</Center>
      </Card>
    </div>
  );
};
