import React from 'react';
import { Table, TableProps, Tbody, Td, TdProps, Th, ThProps, Thead, Tr, TrProps } from '@patternfly/react-table';
import {
  Pagination,
  PaginationProps,
  Toolbar,
  ToolbarItem,
  ToolbarItemProps,
  ToolbarProps
} from '@patternfly/react-core';
import { FilterToolbar, FilterToolbarProps, ToolbarBulkSelector, ToolbarBulkSelectorProps } from '../tackle2-ui-legacy';
import { TableBatteries } from '../types';

// Table takes no additional props, just PF TableProps

// Thead has no WithBatteries component and is returned as-is from PF for convenience

export interface TrWithBatteriesProps<TItem> extends TrProps {
  /**
   * The API data item represented by this row. Optional because it is omitted for the header row.
   * Should be passed in data rows to make sure row-dependent state like selection and expansion work correctly.
   */
  item?: TItem;
  // TODO maybe also take rowIndex here and render TableRowContentWithBatteries in TrWithBatteries? is that too much abstraction?
  //      if we do that, maybe we accept a boolean to disable built-in controls for specific features?
  // TODO could we make sure we enforce that `item` is passed when this is not the header row? Use DiscriminatedArgs with `isHeaderRow`?
}

export interface ThWithBatteriesProps<TColumnKey extends string> extends ThProps {
  /**
   * The key identifying the column associated with this table header cell.
   */
  columnKey: TColumnKey;
}

// Tbody has no WithBatteries component and is returned as-is from PF for convenience

export interface TdWithBatteriesProps<TColumnKey extends string> extends TdProps {
  /**
   * The key identifying the column associated with this table body cell.
   */
  columnKey: TColumnKey;
}

// ToolbarWithBatteries takes no additional props, just PF ToolbarProps

export type ToolbarBulkSelectorWithBatteriesProps<TItem> = Partial<ToolbarBulkSelectorProps<TItem>>;

export type FilterToolbarWithBatteriesProps<TItem, TFilterCategoryKey extends string> = Partial<
  Omit<FilterToolbarProps<TItem, TFilterCategoryKey>, 'id'>
> &
  Pick<FilterToolbarProps<TItem, TFilterCategoryKey>, 'id'>;

// FilterToolbarWithBatteries takes no additional props, and only the `id` prop (others are handled by propHelpers)

// PaginationToolbarItemWithBatteries takes no additional props, just PF ToolbarItemProps

// PaginationWithBatteries takes no additional props, just PF PaginationProps

export const useTableComponents = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  batteries: Omit<
    TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>,
    'components'
  >
): TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>['components'] => {
  // TODO memoize this declaration? might have to useMemo on tableProps to get the correct narrowed deps
  const TableWithBatteries = React.forwardRef((props: Omit<TableProps, 'ref'>, ref: React.Ref<HTMLTableElement>) => (
    <Table
      {...batteries.propHelpers.tableProps}
      innerRef={ref as React.MutableRefObject<HTMLTableElement>}
      {...props}
    />
  ));
  TableWithBatteries.displayName = 'TableWithBatteries';

  // TODO memoize this declaration? might have to useCallback on getTrProps to get the correct narrowed deps
  const TrWithBatteries = React.forwardRef(
    ({ item, onRowClick, ...props }: Omit<TrWithBatteriesProps<TItem>, 'ref'>, ref: React.Ref<HTMLTableRowElement>) => (
      <Tr
        {...batteries.propHelpers.getTrProps({ item, onRowClick })}
        innerRef={ref as React.MutableRefObject<HTMLTableRowElement>}
        {...props}
      />
    )
  );
  TrWithBatteries.displayName = 'TrWithBatteries';

  // TODO memoize this declaration? might have to useCallback on getThProps to get the correct narrowed deps
  const ThWithBatteries = React.forwardRef(
    ({ columnKey, ...props }: Omit<ThWithBatteriesProps<TColumnKey>, 'ref'>, ref: React.Ref<HTMLTableCellElement>) => (
      <Th
        {...batteries.propHelpers.getThProps({ columnKey })}
        innerRef={ref as React.MutableRefObject<HTMLTableCellElement>}
        {...props}
      />
    )
  );
  ThWithBatteries.displayName = 'ThWithBatteries';

  // TODO memoize this declaration? might have to useCallback on getTdProps to get the correct narrowed deps
  const TdWithBatteries = React.forwardRef(
    ({ columnKey, ...props }: Omit<TdWithBatteriesProps<TColumnKey>, 'ref'>, ref: React.Ref<HTMLTableCellElement>) => (
      <Td
        {...batteries.propHelpers.getTdProps({ columnKey })}
        innerRef={ref as React.MutableRefObject<HTMLTableCellElement>}
        {...props}
      />
    )
  );
  TdWithBatteries.displayName = 'TdWithBatteries';

  // TODO memoize this declaration? might have to useMemo on toolbarProps to get the correct narrowed deps
  // Note: Toolbar probably should also be a forwardRef, but the Toolbar PF component does not pass down a ref
  //       even though it accepts one in its props (via extending props for HTMLDivElement).
  const ToolbarWithBatteries: React.FC<Omit<ToolbarProps, 'ref'>> = (props) => (
    <Toolbar {...batteries.propHelpers.toolbarProps} {...props} />
  );

  // TODO memoize this declaration? might have to useMemo on toolbarBulkSelectorProps to get the correct narrowed deps
  const ToolbarBulkSelectorWithBatteries: React.FC<ToolbarBulkSelectorWithBatteriesProps<TItem>> = (props) => (
    <ToolbarBulkSelector {...batteries.propHelpers.toolbarBulkSelectorProps} {...props} />
  );

  // TODO memoize this declaration? might have to useMemo on filterToolbarProps to get the correct narrowed deps
  // TODO FilterToolbar needs to be rewritten, but for now we'll wrap it too so we don't need any propHelpers in the consumer code.
  const FilterToolbarWithBatteries: React.FC<FilterToolbarWithBatteriesProps<TItem, TFilterCategoryKey>> = (props) =>
    batteries.filter.isEnabled ? <FilterToolbar {...batteries.propHelpers.filterToolbarProps} {...props} /> : null;

  // TODO memoize this declaration? might have to useMemo on paginationToolbarItemProps to get the correct narrowed deps
  const PaginationToolbarItemWithBatteries: React.FC<ToolbarItemProps> = (props) => (
    <ToolbarItem {...batteries.propHelpers.paginationToolbarItemProps} {...props} />
  );

  // TODO memoize this declaration? might have to useMemo on paginationProps to get the correct narrowed deps
  const PaginationWithBatteries: React.FC<PaginationProps> = (props) => (
    <Pagination {...batteries.propHelpers.paginationProps} {...props} />
  );

  return {
    Table: TableWithBatteries,
    Thead, // Included here as-is in case we need to use a batteries component here in the future
    Tr: TrWithBatteries,
    Th: ThWithBatteries,
    Tbody, // Included here as-is in case we need to use a batteries component here in the future
    Td: TdWithBatteries,
    Toolbar: ToolbarWithBatteries,
    ToolbarBulkSelector: ToolbarBulkSelectorWithBatteries,
    FilterToolbar: FilterToolbarWithBatteries,
    PaginationToolbarItem: PaginationToolbarItemWithBatteries,
    Pagination: PaginationWithBatteries
  };
};
