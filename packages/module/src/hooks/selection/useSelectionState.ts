import React from 'react';
import { DiscriminatedArgs } from '../../type-utils';
import { ItemId } from '../../types';

/**
 * The "source of truth" state for the selection feature.
 * - Included in the object returned by useTableState (TableState) under the `selectionState` property.
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
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
 * Args for useSelectionState
 * - Makes up part of the arguments object taken by useTableState (UseTableStateArgs)
 * - The properties defined here are only required by useTableState if isSelectionEnabled is true (see DiscriminatedArgs)
 * - Properties here are included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see UseTableStateArgs
 * @see DiscriminatedArgs
 * @see TableBatteries
 */
export type UseSelectionStateArgs = DiscriminatedArgs<
  'isSelectionEnabled',
  {
    /**
     * Ids of items to have pre-selected on first render
     */
    initialSelectedItemIds?: ItemId[];
  }
>;

/**
 * Provides the "source of truth" state for the selection feature.
 * - Used internally by useTableState
 * - NOTE: usePersistentState is not used here because in order to work correctly,
 *   selection state cannot be persisted. The `selectedItems` array we get from `getSelectionDerivedState`
 *   is based on a cache of the API items that have been seen in the current session.
 *   if we need to restore selection state on a page reload, we no longer have all the selected item data
 *   in memory. We just use a plain React.useState here and if we have selected items in state we'll
 *   always have those item objects cached.
 * @see PersistTarget
 */
export const useSelectionState = (args: UseSelectionStateArgs): SelectionState => {
  const { isSelectionEnabled } = args;
  const initialSelectedItemIds = (isSelectionEnabled && args.initialSelectedItemIds) || [];

  const [selectedItemIds, setSelectedItemIds] = React.useState<ItemId[]>(initialSelectedItemIds);
  return { selectedItemIds, setSelectedItemIds };
};
