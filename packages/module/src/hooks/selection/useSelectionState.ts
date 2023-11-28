import React from 'react';
import { ItemId } from '../../types';

/**
 * Feature-specific args for useSelectionState
 * - Used as the `selection` sub-object in args of both useSelectionState and useTableState as a whole
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see UseTableStateArgs
 * @see TableBatteries
 */
export interface SelectionStateArgs {
  /**
   * Ids of items to have pre-selected on first render
   */
  initialSelectedItemIds?: ItemId[];
  // TODO how do we avoid the confusion of passing `selection: {}` to enable selection?
  // TODO it doesn't make sense to require initialSelectedItemIds. Maybe we do need an `enabled: true`?
  // TODO or can we have `selection: true` as a possible way to pass it and still inherit things the way we want to?
}

/**
 * The "source of truth" state for the selection feature.
 * - Included in the `TableState` object returned by useTableState under the `selection` sub-object (combined with args above).
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * - Omit the `selection` object arg to disable the selection feature.
 * @see TableState
 * @see TableBatteries
 */
export interface SelectionState {
  /**
   * The ids of the currently selected items
   */
  selectedItemIds: ItemId[];
  /**
   * Updates the entire list of selected item ids
   */
  setSelectedItemIds: React.Dispatch<React.SetStateAction<ItemId[]>>;
}

/**
 * Provides the "source of truth" state for the selection feature.
 * - Used internally by useTableState
 * - NOTE: usePersistentState is not used here because in order to work correctly,
 *   selection state cannot be persisted. The `selectedItems` array we get from `useSelectionDerivedState`
 *   is based on a cache of the API items that have been seen in the current session.
 *   if we need to restore selection state on a page reload, we no longer have all the selected item data
 *   in memory. We just use a plain React.useState here and if we have selected items in state we'll
 *   always have those item objects cached.
 * @see PersistTarget
 */
export const useSelectionState = (args: { selection?: SelectionStateArgs }): SelectionState => {
  const initialSelectedItemIds = args.selection?.initialSelectedItemIds || [];
  const [selectedItemIds, setSelectedItemIds] = React.useState<ItemId[]>(initialSelectedItemIds);
  return { selectedItemIds, setSelectedItemIds };
};
