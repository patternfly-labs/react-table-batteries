import { useTablePropHelpers } from './useTablePropHelpers';
import {
  GetClientTableDerivedStateArgs,
  TableBatteries,
  TableState,
  UseClientTableBatteriesArgs,
  UseTablePropHelpersArgs
} from '../types';
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

  // TODO figure out why the `as` below is necessary, the `{ ...args, ...state }` should be enough for TS to infer the rest
  // TODO do we have an actual issue with types here or is this a limitation of TS inference?
  const derivedState = getClientTableDerivedState({ ...args, ...state } as TableState<
    TItem,
    TColumnKey,
    TSortableColumnKey,
    TFilterCategoryKey,
    TPersistenceKeyPrefix
  > &
    GetClientTableDerivedStateArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey>);

  const argsForGetClientTableDerivedState = { ...args, ...state };
  const argsForUseTablePropHelpers = { ...args, ...state, ...derivedState };
  // eslint-disable-next-line no-console
  console.log({ argsForGetClientTableDerivedState, argsForUseTablePropHelpers });

  // TODO figure out why the `as` below is necessary, the `{ ...args, ...state }` should be enough for TS to infer the rest
  // TODO do we have an actual issue with types here or is this a limitation of TS inference?
  return useTablePropHelpers({
    ...args,
    ...state,
    ...derivedState
  } as UseTablePropHelpersArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>);
};
