import React from 'react';
import { Th } from '@patternfly/react-table';
import { TableBatteries } from '../../../types';

export interface TableHeaderContentWithBatteriesProps<
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
> extends TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> {
  children: React.ReactNode;
}

export const TableHeaderContentWithBatteries = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  props: React.PropsWithChildren<
    TableHeaderContentWithBatteriesProps<
      TItem,
      TColumnKey,
      TSortableColumnKey,
      TFilterCategoryKey,
      TPersistenceKeyPrefix
    >
  >
) => {
  const { numColumnsBeforeData, numColumnsAfterData, children } = props;
  return (
    <>
      {Array(numColumnsBeforeData)
        .fill(null)
        .map((_, i) => (
          <Th key={i} />
        ))}
      {children}
      {Array(numColumnsAfterData)
        .fill(null)
        .map((_, i) => (
          <Th key={i} />
        ))}
    </>
  );
};
