import React from 'react';
import { Td } from '@patternfly/react-table';
import { ITableBatteries } from '../../../types';

export interface ITableRowContentWithBatteriesProps<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> {
  isExpansionEnabled?: boolean;
  expandableVariant?: 'single' | 'compound';
  isSelectionEnabled?: boolean;
  propHelpers: ITableBatteries<
    TItem,
    TColumnKey,
    TSortableColumnKey,
    TFilterCategoryKey,
    TPersistenceKeyPrefix
  >['propHelpers'];
  item: TItem;
  rowIndex: number;
  children: React.ReactNode;
}

export const TableRowContentWithBatteries = <TItem, TColumnKey extends string, TSortableColumnKey extends TColumnKey>({
  isExpansionEnabled = false,
  expandableVariant,
  isSelectionEnabled = false,
  propHelpers: { getSingleExpandButtonTdProps, getSelectCheckboxTdProps },
  item,
  rowIndex,
  children
}: React.PropsWithChildren<ITableRowContentWithBatteriesProps<TItem, TColumnKey, TSortableColumnKey>>) => (
  <>
    {isExpansionEnabled && expandableVariant === 'single' ? (
      <Td {...getSingleExpandButtonTdProps({ item, rowIndex })} />
    ) : null}
    {isSelectionEnabled ? <Td {...getSelectCheckboxTdProps({ item, rowIndex })} /> : null}
    {children}
  </>
);