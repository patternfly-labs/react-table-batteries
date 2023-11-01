import { getLocalFilterDerivedState } from './filtering';
import { getLocalSortDerivedState } from './sorting';
import { getLocalPaginationDerivedState } from './pagination';
import { IGetClientTableDerivedStateArgs, ITableDerivedState, ITableState } from '../types';

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
  args: ITableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> &
    IGetClientTableDerivedStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>
): ITableDerivedState<TItem> => {
  const { items, isPaginationEnabled = true } = args;
  const { filteredItems } = getLocalFilterDerivedState({
    ...args,
    items
  });
  const { sortedItems } = getLocalSortDerivedState({
    ...args,
    items: filteredItems
  });
  const { currentPageItems } = getLocalPaginationDerivedState({
    ...args,
    items: sortedItems
  });
  return {
    totalItemCount: items.length,
    currentPageItems: isPaginationEnabled ? currentPageItems : sortedItems
  };
};
