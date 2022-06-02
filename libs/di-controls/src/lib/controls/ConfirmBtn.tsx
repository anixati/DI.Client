import { Button, Group, Popover, SharedButtonProps, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import {} from 'tabler-icons-react';

export interface ConfirmBtnProps extends SharedButtonProps {
  confirmTxt: string;
  btnTxt: string;
  OnOk: () => void;
}

export const ConfirmBtn: React.FC<ConfirmBtnProps> = (rx) => {
  const [opened, setOpened] = useState(false);

  const openPopOver = () => {
    setOpened(true);
  };
  const closePopOver = () => {
    setOpened(false);
  };
  const confirmYes = () => {
    setOpened(false);
    rx.OnOk();
  };
  return (
    <Popover
      opened={opened}
      onClose={closePopOver}
      target={
        <Button {...rx} onClick={openPopOver}>
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
          <Text size="lg" color="dotars" weight="500">
            {rx.confirmTxt}
          </Text>
        </Group>
        <Group spacing={8} position="right">
          <Button variant="filled" color="red" onClick={confirmYes}>
            Yes
          </Button>
          <Button variant="default" onClick={closePopOver}>
            No
          </Button>
        </Group>
      </Stack>
    </Popover>
  );
};
