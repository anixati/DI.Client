import { InputWrapper, Popover,Text, Tooltip } from '@mantine/core';
import { useId } from '@mantine/hooks';
import { useField } from 'formik';
import { useEffect, useState } from 'react';
import { wrapperProps } from './wrapperProps';


export const Wrapper = <T = unknown>(rx: wrapperProps<T>) => {
  const [field, meta] = useField(rx.opr);
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    setOpened(meta.touched && meta.error !== undefined);
  }, [meta]);
  const uid = useId();
  return (
    // <Popover
    //   position="bottom"
    //   placement="start"
    //   gutter={2} radius="xs"
    //   spacing={5}
    //   shadow="xs"
    //   opened={opened}
    //   withArrow
    //   styles={{ popover: { width: '100%'}}}
    //   trapFocus={false}
    //   transition="pop-top-left"
    //   target={
      <Tooltip      opened={opened}      label={meta.touched && meta.error && meta.error}
      color="red"      position="bottom"      placement="start"      withArrow    style={{  width: '100%' }} >
        <InputWrapper
          id={uid}
          label={rx.opr.label}
          required={rx.opr.required ? rx.opr.required : false}
          description={rx.opr.desc ? rx.opr.desc : null}
          size="xs"
          //  error={<ErrorMsg {...meta} />}
          style={{ width: rx.opr.width ? `${rx.opr.width}%` : '100%' }}
        >
          {rx.renderFld(uid, field, meta)}
        </InputWrapper>
        </Tooltip>
    //   }
    // >
    //  <Text size="xs" color="red">{meta.touched && meta.error && meta.error}</Text>
    // </Popover>
  );
};


