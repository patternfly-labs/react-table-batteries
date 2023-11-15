import { PaginationProps } from '@patternfly/react-core';
import { ToolbarBulkSelectorProps } from '../../tackle2-ui-legacy/components/ToolbarBulkSelector';
import { UseSelectionDerivedStateArgs, useSelectionDerivedState } from './useSelectionDerivedState';
import { UseSelectionEffectsArgs, useSelectionEffects } from './useSelectionEffects';
import { TdProps } from '@patternfly/react-table';
/**
 * Args for useSelectionPropHelpers that come from outside useTablePropHelpers
 * - Partially satisfied by the object returned by useTableState (TableState)
 * - Makes up part of the arguments object taken by useTablePropHelpers (UseTablePropHelpersArgs)
 * @see TableState
 * @see UseTablePropHelpersArgs
 */
export type UseSelectionPropHelpersExternalArgs<TItem> = UseSelectionDerivedStateArgs<TItem> &
  Omit<UseSelectionEffectsArgs<TItem>, 'selectionDerivedState'>;

/**
 * Additional args for useSelectionPropHelpers that come from logic inside useTablePropHelpers
 * @see useTablePropHelpers
 */
export interface UseSelectionPropHelpersInternalArgs {
  /**
   * Pagination props returned by usePaginationPropHelpers
   */
  paginationProps: PaginationProps;
}

// TODO implement that behavior from PF docs where groups of items can be selected by shift+clicking on checkboxes
export const useSelectionPropHelpers = <TItem>(
  args: UseSelectionPropHelpersExternalArgs<TItem> & UseSelectionPropHelpersInternalArgs
) => {
  const { paginationProps, currentPageItems } = args;
  const selectionDerivedState = useSelectionDerivedState(args);
  const { selectAll, selectItem, selectItems, selectedItems, isItemSelected, allSelected } = selectionDerivedState;

  useSelectionEffects({ ...args, selectionDerivedState });

  /**
   * Props for the ToolbarBulkSelector component.
   */
  const toolbarBulkSelectorProps: ToolbarBulkSelectorProps<TItem> = {
    onSelectAll: selectAll,
    areAllSelected: allSelected,
    selectedRows: selectedItems,
    paginationProps,
    currentPageItems,
    onSelectMultiple: selectItems
  };

  /**
   * Returns props for the Td component used as the checkbox cell for each row when using the selection feature.
   */
  const getSelectCheckboxTdProps: (args: { item: TItem; rowIndex: number }) => Omit<TdProps, 'ref'> = ({
    item,
    rowIndex
  }) => ({
    select: {
      rowIndex,
      onSelect: (_event, isSelecting) => {
        selectItem(item, isSelecting);
      },
      isSelected: isItemSelected(item)
    }
  });

  return { selectionDerivedState, toolbarBulkSelectorProps, getSelectCheckboxTdProps };
};
