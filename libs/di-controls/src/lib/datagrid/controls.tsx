/* #region  Row select control */

import { IColumnDef } from '@dotars/di-core';
import { Anchor, Checkbox } from '@mantine/core';
import moment from 'moment';
import { forwardRef, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CellProps, Column } from 'react-table';
import { IIndeterminateInputProps } from './types';

export const SelectBox = forwardRef<HTMLInputElement, IIndeterminateInputProps>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef(null);
  const resolvedRef: any = ref || defaultRef;
  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);
  return <Checkbox color="dotars" radius="xs" size="xs" ref={resolvedRef} {...rest} />;
});

//---------------------------------------------------LINK COLUMNS------------------------------------------------------------

export const LinkCol = (def: IColumnDef, pathname: string): Column<any> => {
  //  const rp = def.linkPath ? `/${def.linkPath}` : `${pathname}/`;
  return {
    Header: `${def.Header}`,
    id: `${def.accessor}-link`,
    accessor: `${def.accessor}`,
    Cell: ({ row }: CellProps<any>) => {
      const linkTo = `${def.linkPath}/${row.original[def.linkId]}`;
      return (
        <Anchor component={Link} to={linkTo} size="xs" color="blue" variant="text">
          {row.original[def.accessor]}
        </Anchor>
      );
    },
  };
};
//---------------------------------------------------DATE COLUMNS------------------------------------------------------------

export const DateCol = (def: IColumnDef): Column<any> => {
  //  const rp = def.linkPath ? `/${def.linkPath}` : `${pathname}/`;
  return {
    Header: `${def.Header}`,
    id: `${def.accessor}-date`,
    accessor: `${def.accessor}`,
    Cell: (props) => {
      return moment(props.value).local().format('DD/MM/YYYY');
    },
  };
};
