import React from 'react';
import { Td } from '@patternfly/react-table';
import { TableBatteries } from '../../../types';

export interface TableRowContentWithBatteriesProps<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> extends TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> {
  item: TItem;
  rowIndex: number;
  children: React.ReactNode;
}

export const TableRowContentWithBatteries = <TItem, TColumnKey extends string, TSortableColumnKey extends TColumnKey>(
  props: React.PropsWithChildren<TableRowContentWithBatteriesProps<TItem, TColumnKey, TSortableColumnKey>>
) => {
  const {
    expansion,
    selection,
    propHelpers: { getSingleExpandButtonTdProps, getSelectCheckboxTdProps },
    item,
    rowIndex,
    children
  } = props;
  return (
    <>
      {expansion?.variant === 'single' ? <Td {...getSingleExpandButtonTdProps({ item, rowIndex })} /> : null}
      {selection ? <Td {...getSelectCheckboxTdProps({ item, rowIndex })} /> : null}
      {children}
    </>
  );
};
