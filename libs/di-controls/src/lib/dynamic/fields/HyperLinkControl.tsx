import { Anchor, Box, Group, InputWrapper } from '@mantine/core';
import { Link } from 'react-router-dom';
import { FLDWIDTH, ISchemaFieldProps } from './SchemaFieldFactory';

export const HyperLinkControl = (rx: ISchemaFieldProps) => {
  const { field } = rx;

  return (
    <InputWrapper required={false} label={field.title} size="xs" placeholder={`Please select ${field.title}`} style={{ marginTop: 10, width: `${rx.width ? rx.width : FLDWIDTH}%` }}>
      <div>
         <Anchor href={`${field.options}`} target="_blank" size="sm" variant="gradient">
          {field.description}
        </Anchor>
      </div>
       
    </InputWrapper>
  );
};
