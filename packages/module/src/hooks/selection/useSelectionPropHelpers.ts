// TODO implement that behavior from PF docs where groups of items can be selected by shift+clicking or ctrl+clicking on checkboxes

import { GetSelectionDerivedStateArgs, getSelectionDerivedState } from './getSelectionDerivedState';
import { SelectionState } from './useSelectionState';

// // TODO move this to a useSelectionPropHelpers when we move selection from lib-ui
// const toolbarBulkSelectorProps: PropHelpers['toolbarBulkSelectorProps'] = {
//   onSelectAll: selectAll,
//   areAllSelected,
//   selectedRows: selectedItems,
//   paginationProps,
//   currentPageItems,
//   onSelectMultiple: selectMultiple
// };

// // TODO move this into a useSelectionPropHelpers and make it part of getTdProps once we move selection from lib-ui
// const getSelectCheckboxTdProps: PropHelpers['getSelectCheckboxTdProps'] = ({ item, rowIndex }) => ({
//   select: {
//     rowIndex,
//     onSelect: (_event, isSelecting) => {
//       toggleItemSelected(item, isSelecting);
//     },
//     isSelected: isItemSelected(item)
//   }
// });

/**
 * Args for useSelectionPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export type UseSelectionPropHelpersExternalArgs<TItem> = GetSelectionDerivedStateArgs<TItem> & {
  /**
   * The "source of truth" state for the selection feature (returned by useSelectionState)
   */
  selectionState: SelectionState;
};

export const useSelectionPropHelpers = <TItem>(args: UseSelectionPropHelpersExternalArgs<TItem>) => {
  const selectionDerivedState = getSelectionDerivedState(args);
  console.log('TODO!'); // TODO
  return { selectionDerivedState, toolbarBulkSelectorProps, getSelectCheckboxTdProps };
};
