import { getClientFilterDerivedState } from './filtering';
import { getClientSortDerivedState } from './sorting';
import { getClientPaginationDerivedState } from './pagination';
import { GetClientTableDerivedStateArgs, TableDerivedState, TableState } from '../types';

/**
 * Returns table-level "derived state" (the results of local/client-computed filtering/sorting/pagination)
 * - Used internally by the shorthand hook useClientTableBatteries.
 * - Takes "source of truth" state for all features and additional args.
 * @see useClientTableBatteries
 */
export const getClientTableDerivedState = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  args: TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> &
    GetClientTableDerivedStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>
): TableDerivedState<TItem> => {
  const { items, isPaginationEnabled = true } = args;
  const { filteredItems } = getClientFilterDerivedState({
    ...args,
    items
  });
  const { sortedItems } = getClientSortDerivedState({
    ...args,
    items: filteredItems
  });
  const { currentPageItems } = getClientPaginationDerivedState({
    ...args,
    items: sortedItems
  });
  return {
    totalItemCount: items.length,
    currentPageItems: isPaginationEnabled ? currentPageItems : sortedItems
  };
};
