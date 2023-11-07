import React from 'react';
import { DiscriminatedArgs } from '../../type-utils';
import { ItemId, FeaturePersistenceArgs } from '../../types';
import { parseMaybeNumericString } from '../../utils';
import { usePersistentState } from '../generic/usePersistentState';

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
  setSelectedItemIds: (ids: ItemId[]) => void;
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
 * Provides the "source of truth" state for the sort feature.
 * - Used internally by useTableState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 * @see PersistTarget
 */
export const useSelectionState = <TPersistenceKeyPrefix extends string = string>(
  args: UseSelectionStateArgs & FeaturePersistenceArgs<TPersistenceKeyPrefix>
): SelectionState => {
  const { isSelectionEnabled, persistTo = 'state', persistenceKeyPrefix } = args;

  const initialSelectedItemIds = (isSelectionEnabled && args.initialSelectedItemIds) || [];

  // We won't need to pass the latter two type params here if TS adds support for partial inference.
  // See https://github.com/konveyor/tackle2-ui/issues/1456
  const [selectedItemIds, setSelectedItemIds] = usePersistentState<ItemId[], TPersistenceKeyPrefix, 'selected'>({
    isEnabled: !!isSelectionEnabled,
    defaultValue: initialSelectedItemIds,
    persistenceKeyPrefix,
    // Note: For the discriminated union here to work without TypeScript getting confused
    //       (e.g. require the urlParams-specific options when persistTo === "urlParams"),
    //       we need to pass persistTo inside each type-narrowed options object instead of outside the ternary.
    ...(persistTo === 'urlParams'
      ? {
          persistTo,
          keys: ['selected'],
          serialize: (activeSelection) => ({
            selected: activeSelection
              ? activeSelection
                  .filter(Boolean)
                  .map((id) => String(id))
                  .join(',')
              : null
          }),
          deserialize: ({ selected }) =>
            selected ? (selected.split(',').map(parseMaybeNumericString).filter(Boolean) as ItemId[]) : []
        }
      : persistTo === 'localStorage' || persistTo === 'sessionStorage'
      ? {
          persistTo,
          key: 'selected'
        }
      : { persistTo })
  });
  return { selectedItemIds, setSelectedItemIds };
};
