import React from 'react';
import { SelectionDerivedState } from './useSelectionDerivedState';

export interface UseSelectionEffectsArgs<TItem> {
  isItemSelectable?: (item: TItem) => boolean;
  selectionDerivedState: SelectionDerivedState<TItem>;
}

export const useSelectionEffects = <TItem>({
  isItemSelectable,
  selectionDerivedState: { selectedItems, setSelectedItems }
}: UseSelectionEffectsArgs<TItem>) => {
  // If isItemSelectable changes and a selected item is no longer selectable, deselect it
  React.useEffect(() => {
    if (isItemSelectable && !selectedItems.every(isItemSelectable)) {
      setSelectedItems(selectedItems.filter(isItemSelectable));
    }
  }, [isItemSelectable, selectedItems, setSelectedItems]);
};
