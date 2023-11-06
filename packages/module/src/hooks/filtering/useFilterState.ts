import { FilterValues, FilterCategory } from '../../tackle2-ui-legacy/components/FilterToolbar';
import { DiscriminatedArgs } from '../../type-utils';
import { FeaturePersistenceArgs } from '../../types';
import { usePersistentState } from '../generic/usePersistentState';
import { serializeFilterUrlParams } from './helpers';
import { deserializeFilterUrlParams } from './helpers';

/**
 * The "source of truth" state for the filter feature.
 * - Included in the object returned by useTableState (TableState) under the `filterState` property.
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableState
 * @see TableBatteries
 */
export interface FilterState<TFilterCategoryKey extends string> {
  /**
   * A mapping:
   * - from string keys uniquely identifying a filterCategory (inferred from the `key` properties of elements in the `filterCategories` array)
   * - to arrays of strings representing the current value(s) of that filter. Single-value filters are stored as an array with one element.
   */
  filterValues: FilterValues<TFilterCategoryKey>;
  /**
   * Updates the `filterValues` mapping.
   */
  setFilterValues: (values: FilterValues<TFilterCategoryKey>) => void;
}

/**
 * Args for useFilterState
 * - Makes up part of the arguments object taken by useTableState (UseTableStateArgs)
 * - The properties defined here are only required by useTableState if isFilterEnabled is true (see DiscriminatedArgs)
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see UseTableStateArgs
 * @see DiscriminatedArgs
 * @see TableBatteries
 */
export type UseFilterStateArgs<TItem, TFilterCategoryKey extends string> = DiscriminatedArgs<
  'isFilterEnabled',
  {
    /**
     * Definitions of the filters to be used (must include `getItemValue` functions for each category when performing filtering locally)
     */
    filterCategories: FilterCategory<TItem, TFilterCategoryKey>[];
    /**
     * Initial filter values to use on first render (optional)
     */
    initialFilterValues?: FilterValues<TFilterCategoryKey>;
  }
>;

/**
 * Provides the "source of truth" state for the filter feature.
 * - Used internally by useTableState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 * @see PersistTarget
 */
export const useFilterState = <TItem, TFilterCategoryKey extends string, TPersistenceKeyPrefix extends string = string>(
  args: UseFilterStateArgs<TItem, TFilterCategoryKey> & FeaturePersistenceArgs<TPersistenceKeyPrefix>
): FilterState<TFilterCategoryKey> => {
  const { isFilterEnabled, persistTo = 'state', persistenceKeyPrefix } = args;
  const initialFilterValues: FilterValues<TFilterCategoryKey> = (isFilterEnabled && args.initialFilterValues) || {};

  // We won't need to pass the latter two type params here if TS adds support for partial inference.
  // See https://github.com/konveyor/tackle2-ui/issues/1456
  const [filterValues, setFilterValues] = usePersistentState<
    FilterValues<TFilterCategoryKey>,
    TPersistenceKeyPrefix,
    'filters'
  >({
    isEnabled: !!isFilterEnabled,
    defaultValue: initialFilterValues,
    persistenceKeyPrefix,
    // Note: For the discriminated union here to work without TypeScript getting confused
    //       (e.g. require the urlParams-specific options when persistTo === "urlParams"),
    //       we need to pass persistTo inside each type-narrowed options object instead of outside the ternary.
    ...(persistTo === 'urlParams'
      ? {
          persistTo,
          keys: ['filters'],
          serialize: serializeFilterUrlParams,
          deserialize: deserializeFilterUrlParams
        }
      : persistTo === 'localStorage' || persistTo === 'sessionStorage'
      ? { persistTo, key: 'filters' }
      : { persistTo })
  });
  return { filterValues, setFilterValues };
};
