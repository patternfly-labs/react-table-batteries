import { SortState } from './useSortState';

/**
 * Args for useClientSortDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useClientTableDerivedState (UseClientTableDerivedStateArgs)
 * @see TableState
 * @see UseClientTableDerivedStateArgs
 */
export interface UseClientSortDerivedStateArgs<TItem, TSortableColumnKey extends string> {
  /**
   * The API data items before sorting
   */
  items: TItem[];
  /**
   * Feature-specific args: A subset of the `TableState` object's `sort` property with the state itself and relevant state args
   */
  sort?: SortState<TSortableColumnKey> & {
    /**
     * A callback function to return, for a given API data item, a record of sortable primitives for that item's sortable columns
     * - The record maps:
     *   - from `columnKey` values (the keys of the `columnNames` object passed to useTableState)
     *   - to easily sorted primitive values (string | number | boolean) for this item's value in that column
     */
    // TODO how is this passed in? Should it be an optional part of the sort args in useTableState? Does the consumer need to spread it into the existing sort sub-object?
    getSortValues?: (item: TItem) => Record<TSortableColumnKey, string | number | boolean>;
  };
}

/**
 * Given the "source of truth" state for the sort feature and additional arguments, returns "derived state" values and convenience functions.
 * - For local/client-computed tables only. Performs the actual sorting logic, which is done on the server for server-computed tables.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useClientSortDerivedState = <TItem, TSortableColumnKey extends string>(
  args: UseClientSortDerivedStateArgs<TItem, TSortableColumnKey>
) => {
  const { items } = args;
  const { getSortValues, activeSort } = args?.sort ?? {};
  if (!getSortValues || !activeSort) {
    return { sortedItems: items };
  }

  let sortedItems = items;
  sortedItems = [...items].sort((a: TItem, b: TItem) => {
    let aValue = getSortValues(a)[activeSort.columnKey];
    let bValue = getSortValues(b)[activeSort.columnKey];
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.replace(/ +/g, '');
      bValue = bValue.replace(/ +/g, '');
      const aSortResult = aValue.localeCompare(bValue);
      const bSortResult = bValue.localeCompare(aValue);
      return activeSort.direction === 'asc' ? aSortResult : bSortResult;
    } else if (typeof aValue === 'number' && typeof bValue === 'number') {
      return activeSort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    } else {
      if (aValue > bValue) {
        return activeSort.direction === 'asc' ? -1 : 1;
      }
      if (aValue < bValue) {
        return activeSort.direction === 'asc' ? -1 : 1;
      }
    }

    return 0;
  });

  return { sortedItems };
};
