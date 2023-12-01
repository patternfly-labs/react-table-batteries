import React from 'react';
import { Table, TableProps, Tbody, Td, TdProps, Th, ThProps, Thead, Tr, TrProps } from '@patternfly/react-table';
import { useTableBatteriesContext } from './TableBatteriesContext';
import {
  Pagination,
  PaginationProps,
  Toolbar,
  ToolbarItem,
  ToolbarItemProps,
  ToolbarProps
} from '@patternfly/react-core';
import { FilterToolbar, FilterToolbarProps } from '../tackle2-ui-legacy';

const TableBaseWithBatteries: React.FC<Omit<TableProps, 'ref'>> = (props) => {
  const batteries = useTableBatteriesContext();
  return <Table {...batteries?.propHelpers.tableProps} {...props} />;
};
const TableWithBatteries = React.forwardRef((props: TableProps, ref: React.Ref<HTMLTableElement>) => (
  <TableBaseWithBatteries {...props} innerRef={ref as React.MutableRefObject<HTMLTableElement>} />
));
TableWithBatteries.displayName = 'TableWithBatteries';

export interface TrWithBatteriesProps extends Omit<TrProps, 'ref'> {
  item?: unknown; // TODO FIXME - no access to TItem here for type safety
  // TODO maybe also take rowIndex here and render TableRowContentWithBatteries in here? is that too much abstraction?
  //      if we do that, maybe we accept a boolean to disable built-in controls for specific features?
}
const TrBaseWithBatteries: React.FC<TrWithBatteriesProps> = ({ item, onRowClick, ...props }) => {
  const batteries = useTableBatteriesContext();
  return <Tr {...batteries?.propHelpers.getTrProps({ item, onRowClick })} {...props} />;
};
const TrWithBatteries = React.forwardRef((props: TrWithBatteriesProps, ref: React.Ref<HTMLTableRowElement>) => (
  <TrBaseWithBatteries {...props} innerRef={ref as React.MutableRefObject<HTMLTableRowElement>} />
));
TrWithBatteries.displayName = 'TrWithBatteries';

export interface ThWithBatteriesProps extends Omit<ThProps, 'ref'> {
  columnKey: string; // TODO FIXME - no access to TColumnKey here for type safety
}
const ThBaseWithBatteries: React.FC<ThWithBatteriesProps> = ({ columnKey, ...props }) => {
  const batteries = useTableBatteriesContext();
  return <Th {...batteries?.propHelpers.getThProps({ columnKey })} {...props} />;
};
const ThWithBatteries = React.forwardRef((props: ThWithBatteriesProps, ref: React.Ref<HTMLTableCellElement>) => (
  <ThBaseWithBatteries {...props} innerRef={ref as React.MutableRefObject<HTMLTableCellElement>} />
));
ThWithBatteries.displayName = 'ThWithBatteries';

export interface TdWithBatteriesProps extends Omit<TdProps, 'ref'> {
  columnKey: string; // TODO FIXME - no access to TColumnKey here for type safety
}
const TdBaseWithBatteries: React.FC<TdWithBatteriesProps> = ({ columnKey, ...props }) => {
  const batteries = useTableBatteriesContext();
  return <Td {...batteries?.propHelpers.getTdProps({ columnKey })} {...props} />;
};
const TdWithBatteries = React.forwardRef((props: TdWithBatteriesProps, ref: React.Ref<HTMLTableCellElement>) => (
  <TdBaseWithBatteries {...props} innerRef={ref as React.MutableRefObject<HTMLTableCellElement>} />
));
TdBaseWithBatteries.displayName = 'TdBaseWithBatteries';

// Note: Toolbar probably should also be a forwardRef, but the Toolbar PF component does not pass down a ref
//       even though it accepts one in its props (via extending props for HTMLDivElement).
const ToolbarWithBatteries: React.FC<Omit<ToolbarProps, 'ref'>> = (props) => {
  const batteries = useTableBatteriesContext();
  return <Toolbar {...batteries?.propHelpers.toolbarProps} {...props} />;
};

// TODO FilterToolbar needs to be rewritten, but for now we'll wrap it too so we don't need any propHelpers in the consumer code.
// TODO FIXME - no access to TItem or TFilterCategoryKey here - this one doesn't affect the consumer though?
const FilterToolbarWithBatteries: React.FC<Pick<FilterToolbarProps<unknown, string>, 'id'>> = (props) => {
  const batteries = useTableBatteriesContext();
  return batteries?.filter.isEnabled ? (
    <FilterToolbar {...batteries?.propHelpers.filterToolbarProps} {...props} />
  ) : null;
};

const PaginationToolbarItemWithBatteries: React.FC<ToolbarItemProps> = (props) => {
  const batteries = useTableBatteriesContext();
  return <ToolbarItem {...batteries?.propHelpers.paginationToolbarItemProps} {...props} />;
};

const PaginationWithBatteries: React.FC<PaginationProps> = (props) => {
  const batteries = useTableBatteriesContext();
  return <Pagination {...batteries?.propHelpers.paginationProps} {...props} />;
};

export const TableComponentsWithBatteries = {
  Table: TableWithBatteries,
  Thead, // Included here as-is in case we need to use a batteries component here in the future
  Tr: TrWithBatteries,
  Th: ThWithBatteries,
  Tbody, // Included here as-is in case we need to use a batteries component here in the future
  Td: TdWithBatteries,
  Toolbar: ToolbarWithBatteries,
  FilterToolbar: FilterToolbarWithBatteries,
  PaginationToolbarItem: PaginationToolbarItemWithBatteries,
  Pagination: PaginationWithBatteries
};
