import React from 'react';

// TODO effects! pass in args, etc.

export const useSelectionEffects = () => {
  // If isItemSelectable changes and a selected item is no longer selectable, deselect it
  React.useEffect(() => {
    if (!selectedItems.every(isItemSelectable)) {
      setSelectedItems(selectedItems.filter(isItemSelectable));
    }
  }, [isItemSelectable, selectedItems, setSelectedItems]);
};
