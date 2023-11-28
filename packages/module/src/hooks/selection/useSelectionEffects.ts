import React from 'react';
import { SelectionDerivedState } from './useSelectionDerivedState';

export interface UseSelectionEffectsArgs<TItem> {
  selection?: SelectionDerivedState<TItem> & {
    isItemSelectable?: (item: TItem) => boolean;
  };
}

export const useSelectionEffects = <TItem>(args: UseSelectionEffectsArgs<TItem>) => {
  const { isItemSelectable = () => true, selectedItems = [], setSelectedItems = () => {} } = args.selection ?? {};
  // If isItemSelectable changes and a selected item is no longer selectable, deselect it
  React.useEffect(() => {
    if (isItemSelectable && !selectedItems.every(isItemSelectable)) {
      setSelectedItems(selectedItems.filter(isItemSelectable));
    }
  }, [isItemSelectable, selectedItems, setSelectedItems]);
};
