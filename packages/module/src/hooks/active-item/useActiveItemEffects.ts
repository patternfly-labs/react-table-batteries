import * as React from 'react';
import { ActiveItemDerivedState } from './getActiveItemDerivedState';
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
   * The "source of truth" state for the active item feature (returned by useActiveItemState)
   */
  activeItemState: ActiveItemState;
  /**
   * The "derived state" for the active item feature (returned by getActiveItemDerivedState)
   */
  activeItemDerivedState: ActiveItemDerivedState<TItem>;
}

/**
 * Registers side effects necessary to prevent invalid state related to the active item feature.
 * - Used internally by useActiveItemPropHelpers as part of useTablePropHelpers
 * - The effect: If some state change (e.g. refetch, pagination interaction) causes the active item to disappear,
 *   remove its id from state so the drawer won't automatically reopen if the item comes back.
 */
export const useActiveItemEffects = <TItem>({
  isLoading,
  activeItemState: { activeItemId },
  activeItemDerivedState: { activeItem, clearActiveItem }
}: UseActiveItemEffectsArgs<TItem>) => {
  React.useEffect(() => {
    if (!isLoading && activeItemId && !activeItem) {
      clearActiveItem();
    }
  }, [isLoading, activeItemId, activeItem]); // TODO fix the exhaustive-deps lint warning here without affecting behavior
};
