import { ISelectedItem } from '@dotars/di-core';
import { ActionIcon, Button, Group, Modal, TextInput } from '@mantine/core';
import { createRef, useEffect, useState } from 'react';
import { Search } from 'tabler-icons-react';
import { SchemaListRef, SchemaListTable } from '../tables';
import { ISchemaFieldProps } from './SchemaFieldFactory';

export const LookupControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  const listRef = createRef<SchemaListRef>();
  const [opened, setOpened] = useState(false);
  const [select, setSelect] = useState<ISelectedItem | undefined>(undefined);
  useEffect(() => {
    const cx = values[rx.field.key];
    if (cx && cx.length > 0) {
      setSelect(JSON.parse(cx));
    } else {
      setSelect(undefined);
    }
  }, [values[rx.field.key]]);

  const clickOn = () => {
    setOpened(true);
    listRef.current?.refresh();
  };
  const onSelect = () => {
    if (listRef.current) {
      const rv = listRef.current.getSelectedRow();
      if (rv !== null) {
        fieldChanged(rx.field.key, JSON.stringify(rv));
        setOpened(false);
      }
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} withCloseButton={false} size="60%" overlayOpacity={0.5} closeOnClickOutside={false} closeOnEscape={false}>
        <SchemaListTable
          mode="LOOKUP"
          ref={listRef}
          schemas={[{ label: 'Select one', value: `${field.options}` }]}
          renderCmds={() => {
            return (
              <Group spacing={2}>
                <Button compact color="dotars" onClick={onSelect}>
                  Select
                </Button>
                <Button compact color="red" onClick={() => setOpened(false)}>
                  Close
                </Button>
              </Group>
            );
          }}
        />
      </Modal>
      <TextInput
        disabled
        required={field.required ? field.required : false}
        label={field.title}
        size="xs"
        placeholder={`Please select ${field.title}`}
        style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }}
        error={errors[rx.field.key]}
        value={select?.label}
        //onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)}
        rightSection={
          <ActionIcon size={24} radius="xs" color="dotars" variant="filled" onClick={clickOn}>
            <Search />
          </ActionIcon>
        }
      />
    </>
  );
};
