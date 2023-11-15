import { useTablePropHelpers } from './useTablePropHelpers';
import { TableBatteries, UseClientTableBatteriesArgs } from '../types';
import { getClientTableDerivedState } from './getClientTableDerivedState';
import { useTableState } from './useTableState';

/**
 * Provides all state, derived state, side-effects and prop helpers needed to manage a local/client-computed table.
 * - Call this and only this if you aren't using server-side filtering/sorting/pagination.
 * - "Derived state" here refers to values and convenience functions derived at render time based on the "source of truth" state.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export const useClientTableBatteries = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  args: UseClientTableBatteriesArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
): TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> => {
  const state = useTableState(args);
  console.log('Compare with properties expected by getClientTableDerivedSDtate: ', { ...args, ...state });
  const derivedState = getClientTableDerivedState({ ...args, ...state });
  return useTablePropHelpers({
    ...args,
    ...state,
    ...derivedState
  });
};

// TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
// & GetClientFilterDerivedStateArgs<...> & GetClientSortDerivedStateArgs<...> & GetClientPaginationDerivedStateArgs<...>
