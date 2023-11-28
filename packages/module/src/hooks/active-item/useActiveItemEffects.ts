import * as React from 'react';
import { ActiveItemDerivedState } from './useActiveItemDerivedState';
import { ActiveItemState } from './useActiveItemState';

/**
 * Args for useActiveItemEffects
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 */
export interface UseActiveItemEffectsArgs<TItem> {
  /**
   * Whether the table data is loading
   */
  isLoading?: boolean;
  /**
   * Feature-specific args: A subset of the `TableState` object's `activeItem` property with state and derived state
   */
  activeItem?: ActiveItemState & ActiveItemDerivedState<TItem>;
}

/**
 * Registers side effects necessary to prevent invalid state related to the active item feature.
 * - Used internally by useActiveItemPropHelpers as part of useTablePropHelpers
 * - The effect: If some state change (e.g. refetch, pagination interaction) causes the active item to disappear,
 *   remove its id from state so the drawer won't automatically reopen if the item comes back.
 */
export const useActiveItemEffects = <TItem>(args: UseActiveItemEffectsArgs<TItem>) => {
  const { isLoading } = args;
  const { activeItemId = null, activeItem = null, clearActiveItem } = args.activeItem ?? {};
  React.useEffect(() => {
    if (!isLoading && activeItemId && !activeItem) {
      clearActiveItem?.();
    }
  }, [activeItem, activeItemId, clearActiveItem, isLoading]);
};
