import { DiscriminatedArgs } from '../../type-utils';
import { FeaturePersistenceArgs } from '../../types';
import { usePersistentState } from '../generic/usePersistentState';

/**
 * The currently applied pagination parameters
 */
export interface ActivePagination {
  /**
   * The current page number on the user's pagination controls (counting from 1)
   */
  pageNumber: number;
  /**
   * The current "items per page" setting on the user's pagination controls (defaults to 10)
   */
  itemsPerPage: number;
}

/**
 * The "source of truth" state for the pagination feature.
 * - Included in the object returned by useTableState (TableState) under the `paginationState` property.
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableState
 * @see TableBatteries
 */
export interface PaginationState extends ActivePagination {
  /**
   * Updates the current page number on the user's pagination controls (counting from 1)
   */
  setPageNumber: (pageNumber: number) => void;
  /**
   * Updates the "items per page" setting on the user's pagination controls (defaults to 10)
   */
  setItemsPerPage: (numItems: number) => void;
}

/**
 * Args for usePaginationState
 * - Makes up part of the arguments object taken by useTableState (UseTableStateArgs)
 * - The properties defined here are only required by useTableState if isPaginationEnabled is true (see DiscriminatedArgs)
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see UseTableStateArgs
 * @see DiscriminatedArgs
 * @see TableBatteries
 */
export type UsePaginationStateArgs = DiscriminatedArgs<
  'isPaginationEnabled',
  {
    /**
     * The initial value of the "items per page" setting on the user's pagination controls (defaults to 10)
     */
    initialItemsPerPage?: number;
  }
>;

/**
 * Provides the "source of truth" state for the pagination feature.
 * - Used internally by useTableState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 * @see PersistTarget
 */
export const usePaginationState = <TPersistenceKeyPrefix extends string = string>(
  args: UsePaginationStateArgs & FeaturePersistenceArgs<TPersistenceKeyPrefix>
): PaginationState => {
  const { isPaginationEnabled, persistTo = 'state', persistenceKeyPrefix } = args;
  const initialItemsPerPage = (isPaginationEnabled && args.initialItemsPerPage) || 10;

  const defaultValue: ActivePagination = {
    pageNumber: 1,
    itemsPerPage: initialItemsPerPage
  };

  // We won't need to pass the latter two type params here if TS adds support for partial inference.
  // See https://github.com/konveyor/tackle2-ui/issues/1456
  const [paginationState, setPaginationState] = usePersistentState<
    ActivePagination,
    TPersistenceKeyPrefix,
    'pageNumber' | 'itemsPerPage'
  >({
    isEnabled: !!isPaginationEnabled,
    defaultValue,
    persistenceKeyPrefix,
    // Note: For the discriminated union here to work without TypeScript getting confused
    //       (e.g. require the urlParams-specific options when persistTo === "urlParams"),
    //       we need to pass persistTo inside each type-narrowed options object instead of outside the ternary.
    ...(persistTo === 'urlParams'
      ? {
          persistTo,
          keys: ['pageNumber', 'itemsPerPage'],
          serialize: (state) => {
            const { pageNumber, itemsPerPage } = state || {};
            return {
              pageNumber: pageNumber ? String(pageNumber) : undefined,
              itemsPerPage: itemsPerPage ? String(itemsPerPage) : undefined
            };
          },
          deserialize: (urlParams) => {
            const { pageNumber, itemsPerPage } = urlParams || {};
            return pageNumber && itemsPerPage
              ? {
                  pageNumber: parseInt(pageNumber),
                  itemsPerPage: parseInt(itemsPerPage)
                }
              : defaultValue;
          }
        }
      : persistTo === 'localStorage' || persistTo === 'sessionStorage'
      ? {
          persistTo,
          key: 'pagination'
        }
      : { persistTo })
  });
  const { pageNumber, itemsPerPage } = paginationState || defaultValue;
  const setPageNumber = (num: number) =>
    setPaginationState({
      pageNumber: num >= 1 ? num : 1,
      itemsPerPage: paginationState?.itemsPerPage || initialItemsPerPage
    });
  const setItemsPerPage = (itemsPerPage: number) =>
    setPaginationState({
      pageNumber: paginationState?.pageNumber || 1,
      itemsPerPage
    });
  return { pageNumber, setPageNumber, itemsPerPage, setItemsPerPage };
};
