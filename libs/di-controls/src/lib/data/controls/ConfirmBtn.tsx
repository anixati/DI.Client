import { Button, Group, Popover, SharedButtonProps, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import {} from 'tabler-icons-react';

export interface ConfirmBtnProps extends SharedButtonProps {
  confirmTxt: string;
  btnTxt: string;
  OnConfirm: () => void;
}

export const ConfirmBtn: React.FC<ConfirmBtnProps> = (rx) => {
  const [opened, setOpened] = useState(false);
  return (
    <Popover
      opened={opened}
      onClose={() => setOpened(false)}
      target={
        <Button {...rx} onClick={() => setOpened(true)}>
          {rx.btnTxt}
        </Button>
      }
      width={360}
      position="top"
      placement="center"
      withArrow
      closeOnClickOutside={false}
      trapFocus={false}
      closeOnEscape={false}
      transition="slide-up"
      radius="md"
    >
      <Stack>
        <Group spacing={8} position="center">
          <Text size="lg" color="dotars" weight="bold">{rx.confirmTxt}</Text>
        </Group>
        <Group spacing={8} position="right">
            <Button variant='filled' color="red" onClick={() => {setOpened(false);rx.OnConfirm();}}>Yes</Button>
            <Button variant='default'onClick={() => {setOpened(false);}}>No</Button>
        </Group>
      </Stack>
    </Popover>
  );
};
