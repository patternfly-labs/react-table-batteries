import { KeyWithValueType } from '../../type-utils';
import { SelectionState } from './useSelectionState';

/**
 * Args for getSelectionDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export interface GetSelectionDerivedStateArgs<TItem> {
  /**
   * The string key/name of a property on the API data item objects that can be used as a unique identifier (string or number)
   */
  idProperty: KeyWithValueType<TItem, string | number>;
  /**
   * The "source of truth" state for the selection feature (returned by useSelectionState)
   */
  selectionState: SelectionState;
  /**
   * Callback to determine if a given item is allowed to be selected. Blocks that item from being present in state.
   */
  isItemSelectable?: (item: TItem) => boolean;
}

/**
 * Derived state for the selection feature
 * - "Derived state" here refers to values and convenience functions derived at render time based on the "source of truth" state.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export interface SelectionDerivedState<TItem> {
  /**
   * The selected items on the current pagination page.
   */
  selectedItems: TItem[];
  /**
   * Toggles selection on one item. Does not select an item that is not selectable (if an isItemSelectable callback is being used).
   */
  selectItem: (item: TItem, isSelecting?: boolean) => void;
  /**
   * Toggles selection on multiple items
   * - If any items are not selected, isSelecting will default to true.
   * - Does not select an item that is not selectable (if an isItemSelectable callback is being used).
   */
  selectMultipleItems: (items: TItem[], isSelecting?: boolean) => void;
  /**
   * Selects all selectable items on the current page.
   * - Does not select an item that is not selectable (if an isItemSelectable callback is being used).
   */
  selectAll: () => void;
  /**
   * Deselects all items.
   */
  selectNone: () => void;
}

/**
 * Given the "source of truth" state for the selection feature and additional arguments, returns "derived state" values and convenience functions.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 *
 * NOTE: Unlike `getClient[Filter|Sort|Pagination]DerivedState`, this is not named `getClientSelectionDerivedState` because it
 * is always local/client-computed, and it is still used when working with server-computed tables
 * (it's not specific to client-only-computed tables like the other `getClient*DerivedState` functions are).
 */
export const getSelectionDerivedState = () => {};
