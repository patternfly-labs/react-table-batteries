import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';

import { TableBatteries, UseTablePropHelpersArgs } from '../types';
import { useFilterPropHelpers } from './filtering';
import { useSortPropHelpers } from './sorting';
import { usePaginationPropHelpers } from './pagination';
import { useSelectionPropHelpers } from './selection';
import { useExpansionPropHelpers } from './expansion';
import { useActiveItemPropHelpers } from './active-item';
import { handlePropagatedRowClick, objectKeys } from '../utils';

/**
 * Returns derived state and prop helpers for all features. Used to make rendering the table components easier.
 * - Takes "source of truth" state and table-level derived state (derived either on the server or in getClientTableDerivedState)
 *   along with API data and additional args.
 * - Also triggers side-effects for some features to prevent invalid state.
 * - If you aren't using server-side filtering/sorting/pagination, call this via the shorthand hook useClientTableBatteries.
 * - If you are using server-side filtering/sorting/pagination, call this last after calling useTableState and fetching your API data.
 * @see useClientTableBatteries
 * @see useTableState
 * @see getClientTableDerivedState
 */
export const useTablePropHelpers = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  args: UseTablePropHelpersArgs<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
): TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix> => {
  type PropHelpers = TableBatteries<
    TItem,
    TColumnKey,
    TSortableColumnKey,
    TFilterCategoryKey,
    TPersistenceKeyPrefix
  >['propHelpers'];

  // Note: To avoid repetition, not all args are destructured here since the entire
  //       args object is passed to other other helpers which require other parts of it.
  //       For future additions, inspect `args` to see if it has anything more you need.
  const {
    forceNumRenderedColumns,
    columnNames,
    hasActionsColumn = false,
    variant,
    isFilterEnabled,
    isSortEnabled,
    isSelectionEnabled,
    isExpansionEnabled,
    isActiveItemEnabled
  } = args;

  const columnKeys = objectKeys(columnNames);

  // Some table controls rely on extra columns inserted before or after the ones included in columnNames.
  // We need to account for those when dealing with props based on column index and colSpan.
  let numColumnsBeforeData = 0;
  let numColumnsAfterData = 0;
  if (isSelectionEnabled) {
    numColumnsBeforeData++;
  }
  if (isExpansionEnabled && args.expandableVariant === 'single') {
    numColumnsBeforeData++;
  }
  if (hasActionsColumn) {
    numColumnsAfterData++;
  }
  const numRenderedColumns = forceNumRenderedColumns || columnKeys.length + numColumnsBeforeData + numColumnsAfterData;

  const { filterPropsForToolbar, propsForFilterToolbar } = useFilterPropHelpers(args);
  const { getSortThProps } = useSortPropHelpers({ ...args, columnKeys });
  const { paginationProps, paginationToolbarItemProps } = usePaginationPropHelpers(args);
  const { selectionDerivedState, toolbarBulkSelectorProps, getSelectCheckboxTdProps } = useSelectionPropHelpers(args); // TODO
  const { expansionDerivedState, getSingleExpandButtonTdProps, getCompoundExpandTdProps, getExpandedContentTdProps } =
    useExpansionPropHelpers({ ...args, columnKeys, numRenderedColumns });
  const { activeItemDerivedState, getActiveItemTrProps } = useActiveItemPropHelpers(args);

  const toolbarProps: PropHelpers['toolbarProps'] = {
    className: variant === 'compact' ? spacing.pt_0 : '',
    ...(isFilterEnabled && filterPropsForToolbar)
  };

  const tableProps: PropHelpers['tableProps'] = {
    variant,
    isExpandable: isExpansionEnabled && !!args.expandableVariant
  };

  const getThProps: PropHelpers['getThProps'] = ({ columnKey }) => ({
    ...(isSortEnabled && getSortThProps({ columnKey: columnKey as TSortableColumnKey })),
    children: columnNames[columnKey]
  });

  const getTrProps: PropHelpers['getTrProps'] = ({ item, onRowClick }) => {
    const activeItemTrProps = getActiveItemTrProps({ item });
    return {
      ...(isActiveItemEnabled && activeItemTrProps),
      onRowClick: (event) =>
        handlePropagatedRowClick(event, () => {
          activeItemTrProps.onRowClick?.(event);
          onRowClick?.(event);
        })
    };
  };

  const getTdProps: PropHelpers['getTdProps'] = (getTdPropsArgs) => {
    const { columnKey } = getTdPropsArgs;
    return {
      dataLabel: columnNames[columnKey],
      ...(isExpansionEnabled &&
        args.expandableVariant === 'compound' &&
        getTdPropsArgs.isCompoundExpandToggle &&
        getCompoundExpandTdProps({
          columnKey,
          item: getTdPropsArgs.item,
          rowIndex: getTdPropsArgs.rowIndex
        }))
    };
  };

  return {
    ...args,
    numColumnsBeforeData,
    numColumnsAfterData,
    numRenderedColumns,
    selectionDerivedState,
    expansionDerivedState,
    activeItemDerivedState,
    propHelpers: {
      toolbarProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps,
      filterToolbarProps: propsForFilterToolbar,
      paginationProps,
      paginationToolbarItemProps,
      toolbarBulkSelectorProps,
      getSelectCheckboxTdProps,
      getSingleExpandButtonTdProps,
      getExpandedContentTdProps
    }
  };
};
