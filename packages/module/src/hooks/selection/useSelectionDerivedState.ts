import { KeyWithValueType } from '../../type-utils';
import { ItemId } from '../../types';
import { SelectionState } from './useSelectionState';

/**
 * Args for useSelectionDerivedState
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export interface UseSelectionDerivedStateArgs<TItem> {
  /**
   * The string key/name of a property on the API data item objects that can be used as a unique identifier (string or number)
   */
  idProperty: KeyWithValueType<TItem, ItemId>;
  /**
   * The "source of truth" state for the selection feature (returned by useSelectionState)
   */
  selectionState: SelectionState;
  /**
   * Callback to determine if a given item is allowed to be selected. Blocks that item from being present in state.
   */
  isItemSelectable?: (item: TItem) => boolean;
  /**
   * The current page of API data items after filtering/sorting/pagination
   */
  currentPageItems: TItem[];
  /**
    The total number of items in the entire un-filtered, un-paginated table (the size of the entire API collection being tabulated).
   */
  totalItemCount: number;
  /**
   * All items in the API collection, if available (client-side tables). Enables selectAll.
   */
  items?: TItem[];
}

/**
 * Derived state for the selection feature
 * - "Derived state" here refers to values and convenience functions derived at render time based on the "source of truth" state.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 */
export interface SelectionDerivedState<TItem> {
  /**
   * The selected items (full API objects from cache).
   */
  selectedItems: TItem[]; // TODO do we need to make sure these are in table sort order?
  /**
   * Returns whether the given item is selected.
   */
  isItemSelected: (item: TItem) => boolean;
  /**
   * Returns whether all items (based on `totalItemCount` argument) are selected.
   */
  allSelected: boolean;
  /**
   * Returns whether all items in `currentPageItems` are selected (and only those items).
   */
  pageSelected: boolean;
  /**
   * Toggles selection on one item. Does not select an item that is not selectable (if an isItemSelectable callback is being used).
   */
  selectItem: (item: TItem, isSelecting?: boolean) => void;
  /**
   * Toggles selection on multiple items
   * - If any items are not selected, isSelecting will default to true.
   * - Does not select an item that is not selectable (if an isItemSelectable callback is being used).
   */
  selectItems: (items: TItem[], isSelecting?: boolean) => void;
  /**
   * Selects all selectable items in the whole API collection.
   * - Only works for client-paginated tables where we've passed in the `items` array containing all items (not just the current page).
   */
  selectAll: () => void;
  /**
   * Selects all selectable items on the current page.
   * - Does not select an item that is not selectable (if an isItemSelectable callback is being used).
   */
  selectPage: () => void;
  /**
   * Deselects all items.
   */
  selectNone: () => void;
  /**
   * Selects the given selectable items and deselects all other items.
   */
  setSelectedItems: (items: TItem[]) => void;
}

/**
 * Given the "source of truth" state for the selection feature and additional arguments, returns "derived state" values and convenience functions.
 * - "source of truth" (persisted) state and "derived state" are kept separate to prevent out-of-sync duplicated state.
 *
 * NOTE: Unlike `getClient[Filter|Sort|Pagination]DerivedState`, this is not named `getClientSelectionDerivedState` because it
 * is always local/client-computed, and it is still used when working with server-computed tables
 * (it's not specific to client-only-computed tables like the other `getClient*DerivedState` functions are).
 */
export const useSelectionDerivedState = <TItem>(
  args: UseSelectionDerivedStateArgs<TItem>
): SelectionDerivedState<TItem> => {
  const {
    idProperty,
    selectionState: { selectedItemIds = [], setSelectedItemIds },
    isItemSelectable = () => true,
    currentPageItems,
    totalItemCount,
    items
  } = args;
  const selectedItems: TItem[] = []; // TODO get these from currentPageItems via a cache: memoize items for ids we've seen that are not in currentPageItems
  const isItemSelected = (item: TItem) => selectedItemIds.includes(item[idProperty] as ItemId);
  return {
    // TODO do we need to turn this into useSelectionDerivedState so we can add the useMemo/useRef/useState cache here?
    // TODO if so, should we convert all the other get*DerivedState stuff to use*DerivedState and maybe even move the use*Effect calls into there and not the prop helpers hooks?
    selectedItems,
    isItemSelected,
    allSelected: selectedItemIds.length === totalItemCount,
    pageSelected:
      currentPageItems.length === selectedItemIds.length &&
      currentPageItems.every((item) => selectedItemIds.includes(item[idProperty] as ItemId)),
    selectItem: (item, isSelecting = true) => {
      if (isSelecting && !isItemSelected(item) && isItemSelectable(item)) {
        setSelectedItemIds((selected) => [...selected, item[idProperty] as ItemId]);
      } else if (!isSelecting) {
        setSelectedItemIds((selected) => selected.filter((id) => id !== item[idProperty]));
      }
    },
    selectItems: (items, isSelecting = items.some(isItemSelected)) => {
      const selectingItems = items.filter(isItemSelectable);
      const selectingItemIds = selectingItems.map((item) => item[idProperty] as ItemId);
      if (isSelecting && selectingItemIds.length > 0) {
        setSelectedItemIds((selected) => [
          ...selected.filter((id) => !selectingItemIds.includes(id)),
          ...selectingItemIds
        ]);
      } else if (!isSelecting) {
        setSelectedItemIds((selected) => selected.filter((id) => !items.find((item) => item[idProperty] === id)));
      }
    },
    selectAll: () => {
      if (!items) {
        // eslint-disable-next-line no-console
        console.warn(
          'selectAll called without `items` array argument present - select all only works for client-paginated tables.'
        );
        return;
      }
      setSelectedItemIds(items.filter(isItemSelectable).map((item) => item[idProperty] as ItemId));
    },
    selectPage: () => {
      setSelectedItemIds(currentPageItems.filter(isItemSelectable).map((item) => item[idProperty] as ItemId));
    },
    selectNone: () => {
      setSelectedItemIds([]);
    },
    setSelectedItems: (items: TItem[]) => {
      setSelectedItemIds(items.map((item) => item[idProperty] as ItemId));
    }
  };
};
