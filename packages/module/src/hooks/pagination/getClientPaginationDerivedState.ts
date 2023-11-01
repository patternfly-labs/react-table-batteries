import { PaginationState } from './usePaginationState';

/**
 * Args for getClientPaginationDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by getClientTableDerivedState (GetClientTableDerivedStateArgs)
 * @see TableState
 * @see GetClientTableDerivedStateArgs
 */
export interface GetClientPaginationDerivedStateArgs<TItem> {
  /**
   * The API data items before pagination (but after filtering)
   */
  items: TItem[];
  /**
   * The "source of truth" state for the pagination feature (returned by usePaginationState)
   */
  paginationState: PaginationState;
}

/**
 * Given the "source of truth" state for the pagination feature and additional arguments, returns "derived state" values and convenience functions.
 * - For local/client-computed tables only. Performs the actual pagination logic, which is done on the server for server-computed tables.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const getClientPaginationDerivedState = <TItem>({
  items,
  paginationState: { pageNumber, itemsPerPage }
}: GetClientPaginationDerivedStateArgs<TItem>) => {
  const pageStartIndex = (pageNumber - 1) * itemsPerPage;
  const currentPageItems = items.slice(pageStartIndex, pageStartIndex + itemsPerPage);
  return { currentPageItems };
};
