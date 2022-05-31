import { ActionIcon, Box, Group, Text, TextInput } from '@mantine/core';
import { ReactNode } from 'react';
import { Refresh, Search } from 'tabler-icons-react';

export interface TableCmdBarProps {
  title: string;
  OnSearch: (value: string) => void;
  OnRefresh: () => void;
  renderCmds?: () => ReactNode;
}

export const TableCmdBar: React.FC<TableCmdBarProps> = (rx) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    rx.OnSearch(value.toLowerCase());
  };
  return (
    <Box>
      <Group spacing="sm" position="apart">
        <Group spacing="sm" position="left">
          <Text weight={500}>{rx.title}</Text>
        </Group>
        <Group position="right" spacing={3}>
          <TextInput size="xs" placeholder="Search" icon={<Search size={14} color="#071E3E" />} onChange={handleSearchChange} />
          <ActionIcon variant="filled" color="dotars" onClick={rx.OnRefresh}>
            <Refresh size={16} />
          </ActionIcon>
          {rx.renderCmds && rx.renderCmds()}
        </Group>
      </Group>
    </Box>
  );
};
