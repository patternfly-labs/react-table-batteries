import React from 'react';
import { SelectionDerivedState } from './getSelectionDerivedState';

// TODO finish implementing effects pattern here!

export interface UseSelectionEffectsArgs<TItem> {
  isItemSelectable?: (item: TItem) => boolean;
  selectionDerivedState: SelectionDerivedState<TItem>;
}

export const useSelectionEffects = <TItem>(args: UseSelectionEffectsArgs<TItem>) => {
  // If isItemSelectable changes and a selected item is no longer selectable, deselect it
  const {
    isItemSelectable,
    selectionDerivedState: { selectedItems, setSelectedItems }
  } = args;
  React.useEffect(() => {
    if (isItemSelectable && !selectedItems.every(isItemSelectable)) {
      setSelectedItems(selectedItems.filter(isItemSelectable));
    }
  }, [isItemSelectable, selectedItems, setSelectedItems]);
};
