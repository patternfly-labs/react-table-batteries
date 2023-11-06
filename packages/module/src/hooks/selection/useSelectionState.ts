import { DiscriminatedArgs } from '../../type-utils';
import { ItemId, FeaturePersistenceArgs } from '../../types';
import { usePersistentState } from '../generic/usePersistentState';

/**
 * The "source of truth" state for the selection feature.
 * - Included in the object returned by useTableState (TableState) under the `selectionState` property.
 * - Also included in the `TableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see TableState
 * @see TableBatteries
 */
export interface SelectionState<TItem> {
  /**
   * The ids of the currently selected items
   */
  selectedItemIds: ItemId[];
  /**
   * Updates the entire list of selected item ids
   */
  setSelectedItemIds: (ids: ItemId[]) => void;
  // TODO do the below shorthand helpers belong here or in useSelectionPropHelpers? I think here, but do we need to move any stuff for other features into the state hooks to be consistent?
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
   * Selects all selectable items.
   * - Does not select an item that is not selectable (if an isItemSelectable callback is being used).
   */
  selectAll: () => void;
  /**
   * Deselects all items.
   */
  selectNone: () => void;
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
export type UseSelectionStateArgs<TItem> = DiscriminatedArgs<
  'isSelectionEnabled',
  {
    /**
     * Ids of items to have pre-selected on first render
     */
    initialSelectedItemIds?: ItemId[];
    /**
     * Callback to determine if a given item is allowed to be selected. Blocks that item from being present in state.
     */
    isItemSelectable?: (item: TItem) => boolean;
  }
>;

/**
 * Provides the "source of truth" state for the sort feature.
 * - Used internally by useTableState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 * @see PersistTarget
 */
export const useSelectionState = <TItem, TPersistenceKeyPrefix extends string = string>(
  args: UseSelectionStateArgs<TItem> & FeaturePersistenceArgs<TPersistenceKeyPrefix>
): SelectionState<TItem> => {
  const { isSelectionEnabled, persistTo = 'state', persistenceKeyPrefix } = args;

  /// LEFT OFF HERE

  // We won't need to pass the latter two type params here if TS adds support for partial inference.
  // See https://github.com/konveyor/tackle2-ui/issues/1456
  const [selectedItemIds, setSelectedItemIds] = usePersistentState<ItemId[], TPersistenceKeyPrefix, 'selected'>({
    isEnabled: !!isSelectionEnabled,
    defaultValue: initialSelection,
    persistenceKeyPrefix,
    // Note: For the discriminated union here to work without TypeScript getting confused
    //       (e.g. require the urlParams-specific options when persistTo === "urlParams"),
    //       we need to pass persistTo inside each type-narrowed options object instead of outside the ternary.
    ...(persistTo === 'urlParams'
      ? {
          persistTo,
          keys: ['sortColumn', 'sortDirection'],
          serialize: (activeSelection) => ({
            sortColumn: activeSelection?.columnKey || null,
            sortDirection: activeSelection?.direction || null
          }),
          deserialize: (urlParams) =>
            urlParams.sortColumn && urlParams.sortDirection
              ? {
                  columnKey: urlParams.sortColumn as TSelectionableColumnKey,
                  direction: urlParams.sortDirection as 'asc' | 'desc'
                }
              : null
        }
      : persistTo === 'localStorage' || persistTo === 'sessionStorage'
      ? {
          persistTo,
          key: 'sort'
        }
      : { persistTo })
  });
  return { activeSelection, setActiveSelection };
};
