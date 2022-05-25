import { Box, Group, Text, ActionIcon, TextInput } from '@mantine/core';
import { ReactNode } from 'react';
import { Plus, Refresh, Search, SquarePlus } from 'tabler-icons-react';

export interface SearchCmdBarProps {
  title: string;
  searchStr: string;
  canCreate?:boolean;
  OnSearch: (value: string) => void;
  OnRefresh: () => void;
  OnCreate: () => void;
}

export const SearchCmdBar: React.FC<SearchCmdBarProps> = (rx) => {
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
          <TextInput size="xs" placeholder="Search" icon={<Search size={14} color="#071E3E" />} value={rx.searchStr} onChange={handleSearchChange} />
          <ActionIcon variant="filled" color="dotars" onClick={rx.OnRefresh}>
            <Refresh size={16} />
          </ActionIcon>
          {/* <Button leftIcon={<Plus />} size="xs" variant="filled" color="indigo" onClick={rx.OnCreate}>
          </Button> */}
          {rx.canCreate && (
           <ActionIcon variant="filled" color="dotars" onClick={rx.OnCreate}>
            <SquarePlus size={16} />
          </ActionIcon> )}
        </Group>
      </Group>
    </Box>
  );
};



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
          <TextInput size="xs" placeholder="Search" icon={<Search size={14} color="#071E3E" />}  onChange={handleSearchChange} />
          <ActionIcon variant="filled" color="dotars" onClick={rx.OnRefresh}>
            <Refresh size={16} />
          </ActionIcon>
          {rx.renderCmds && rx.renderCmds()}
        </Group>
      </Group>
    </Box>
  );
};

