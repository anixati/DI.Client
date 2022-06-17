import { ISelectedItem } from '@dotars/di-core';
import { ActionIcon, Anchor, Box, Button, Group, InputWrapper, Modal ,Text} from '@mantine/core';
import { createRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'tabler-icons-react';
import { SchemaListRef, SchemaListTable } from '../../tables';
import { ISchemaFieldProps } from './SchemaFieldFactory';

export const LookupControl = (rx: ISchemaFieldProps) => {
  const { field, fieldChanged, values, errors } = rx;
  const listRef = createRef<SchemaListRef>();
  const [opened, setOpened] = useState(false);
  const [select, setSelect] = useState<ISelectedItem | undefined>(undefined);
  useEffect(() => {
    const cx = values[field.key];
    if (cx && cx.length > 0) {
      setSelect(JSON.parse(cx));
    } else {
      setSelect(undefined);
    }
  }, [field.key, values]);

  const clickOn = () => {
    setOpened(true);
    listRef.current?.refresh();
  };
  const onSelect = () => {
    if (listRef.current) {
      const rv = listRef.current.getSelectedRow();
      if (rv !== null) {
        console.log(rv,"$$$$$$")
        setSelect(rv);
        fieldChanged(rx.field.key, JSON.stringify(rv));
        setOpened(false);
      }
    }
  };
  const clickClear = () => {
    setSelect(undefined);
    fieldChanged(field.key, '');
  };


  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} withCloseButton={false} size="60%" overlayOpacity={0.5} closeOnClickOutside={false} closeOnEscape={false}>
        <SchemaListTable
          mode="LOOKUP"
          ref={listRef}
          schemas={[{ label: 'Select one', value: `${field.viewId}` }]}
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

      <InputWrapper required={field.required ? field.required : false} label={field.title} size="xs" placeholder={`Please select ${field.title}`} style={{ marginTop: 10, width: `${field?.width ? field.width - 5 : 50}%` }} error={errors[rx.field.key]}>
        <Box style={{ width: '100%', border: '1px solid #CED4DA', height: 30, lineHeight: 28, fontSize: 12, display: 'block', paddingLeft: 10, paddingRight: 10, paddingTop: 5, borderRadius: 3 }}>
          <Group spacing={1} position="apart">
            <Group spacing={1} position="left">
              {/* {select?.label && field.readonly && <Text size='sm'>{select.label}</Text>} */}
              {select?.label && (
                <Anchor component={Link} to={`${field.options}/${select.value}`} size="xs">
                  {select.label}
                </Anchor>
              )}
            </Group>
            {!rx.disabled && (
              <Group spacing={5} position="right">
                {select?.label && (
                  <ActionIcon size={18} radius="xs" color="cyan" onClick={clickClear} disabled={rx.disabled}>
                    <X />
                  </ActionIcon>
                )}
                <ActionIcon size={18} radius="xs" color="cyan" variant="filled" onClick={clickOn} disabled={rx.disabled}>
                  <Search />
                </ActionIcon>
              </Group>
            )}
          </Group>
        </Box>
      </InputWrapper>
    </>
  );
};
