import { ISelectedItem } from '@dotars/di-core';
import { ActionIcon, Button, Group, Modal, TextInput } from '@mantine/core';
import { Console } from 'console';
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
      console.log(cx, JSON.parse(cx), '--');
      setSelect(JSON.parse(cx));
    } else {
      setSelect(undefined);
    }
    console.log(select, '--');
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
        styles={{
          disabled: { opacity: '0.9 !important', color: 'black !important' ,backgroundColor:'#f9fafb !important' },
        }}
        required={field.required ? field.required : false}
        label={field.title}
        size="xs"
        placeholder={`Please select ${field.title}`}
        style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }}
        error={errors[rx.field.key]}
        value={select?.label}
        //onChange={(e) => fieldChanged(rx.field.key, e.currentTarget.value)}
        rightSection={
          <ActionIcon size={18} radius="xs" color="cyan" variant="filled" onClick={clickOn} disabled={rx.disabled}>
            <Search />
          </ActionIcon>
        }
      />
    </>
  );
};
