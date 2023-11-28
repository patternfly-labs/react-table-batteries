import * as React from 'react';
import { PaginationState } from './usePaginationState';

/**
 * Args for usePaginationEffects
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 */
export interface UsePaginationEffectsArgs {
  /**
   * A subset of the `TableState` object's `pagination` property - here we only need the state itself.
   */
  pagination?: PaginationState;
  /**
    The total number of items in the entire un-filtered, un-paginated table (the size of the entire API collection being tabulated).
   */
  totalItemCount: number;
  /**
   * Whether the table data is loading
   */
  isLoading?: boolean;
}

/**
 * Registers side effects necessary to prevent invalid state related to the pagination feature.
 * - Used internally by usePaginationPropHelpers as part of useTablePropHelpers
 * - The effect: When API data updates, if there are fewer total items and the current page no longer exists
 *   (e.g. you were on page 11 and now the last page is 10), move to the last page of data.
 */
export const usePaginationEffects = (args: UsePaginationEffectsArgs) => {
  const { pageNumber = 1, itemsPerPage = 10 } = args.pagination ?? {};
  const { totalItemCount, isLoading } = args;
  // When items are removed, make sure the current page still exists
  const lastPageNumber = Math.max(Math.ceil(totalItemCount / itemsPerPage), 1);
  React.useEffect(() => {
    if (args.pagination && pageNumber > lastPageNumber && !isLoading) {
      args.pagination?.setPageNumber(lastPageNumber);
    }
  }, [args.pagination, isLoading, lastPageNumber, pageNumber]);
};
