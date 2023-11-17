import { useTablePropHelpers } from './useTablePropHelpers';
import { TableBatteries, TableDerivedState, TableState, UseClientTableBatteriesArgs } from '../types';
import { useClientTableDerivedState } from './useClientTableDerivedState';
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

  type Args = UseClientTableBatteriesArgs<
    TItem,
    TColumnKey,
    TSortableColumnKey,
    TFilterCategoryKey,
    TPersistenceKeyPrefix
  >;
  type State = TableState<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>;

  // TODO figure out why the `as` below is necessary, the `{ ...args, ...state }` should be enough for TS to infer the rest
  // TODO do we have an actual issue with types here or is this a limitation of TS inference?
  const derivedState = useClientTableDerivedState({ ...args, ...state } as Args & State);

  // TODO figure out why the `as` below is necessary, the `{ ...args, ...state }` should be enough for TS to infer the rest
  // TODO do we have an actual issue with types here or is this a limitation of TS inference?
  return useTablePropHelpers({ ...args, ...state, ...derivedState } as Args & State & TableDerivedState<TItem>);
};
