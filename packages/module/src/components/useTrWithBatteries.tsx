import React from 'react';
import { useDeepCompareMemo } from 'use-deep-compare';
import { Td, Th, Tr, TrProps } from '@patternfly/react-table';

import { TableBatteries } from '../types';

export interface TrWithBatteriesProps<TItem> extends TrProps {
  /**
   * The API data item represented by this row. Optional because it is omitted for the header row.
   * Should be passed in data rows to make sure row-dependent state like selection and expansion work correctly.
   */
  item?: TItem;
  // TODO maybe also take rowIndex here and render TableRowContentWithBatteries in TrWithBatteries? is that too much abstraction?
  //      if we do that, maybe we accept a boolean to disable built-in controls for specific features?
  // TODO could we make sure we enforce that `item` is passed when this is not the header row? Use DiscriminatedArgs with `isHeaderRow`?
  /**
   * Whether this is the header row at the top of the table, containing Th elements.
   * @default false
   */
  isHeaderRow?: boolean;
  /**
   * Row index within the current page, if this is a body row. Omit for the header row.
   */
  rowIndex?: number;
  /**
   * Whether to render default built-in select checkboxes, single-expand toggles and spacer Th elements for action columns.
   */
  builtInControls?: boolean;
}

export const useTrWithBatteries = <
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
): React.ForwardRefExoticComponent<Omit<TrWithBatteriesProps<TItem>, 'ref'>> => {
  const { selection, expansion, activeItem, propHelpers, numColumnsBeforeData, numColumnsAfterData } = batteries;
  const TrWithBatteries = useDeepCompareMemo(
    () =>
      React.forwardRef(
        (
          {
            item,
            onRowClick,
            isHeaderRow,
            rowIndex,
            builtInControls = true,
            children,
            ...props
          }: Omit<TrWithBatteriesProps<TItem>, 'ref'>,
          ref: React.Ref<HTMLTableRowElement>
        ) => (
          <Tr
            {...propHelpers.getTrProps({ item, onRowClick })}
            innerRef={ref as React.MutableRefObject<HTMLTableRowElement>}
            {...props}
          >
            {builtInControls && item ? (
              isHeaderRow ? (
                <>
                  {Array(numColumnsBeforeData)
                    .fill(null)
                    .map((_, i) => (
                      <Th key={i} />
                    ))}
                  {children}
                  {Array(numColumnsAfterData)
                    .fill(null)
                    .map((_, i) => (
                      <Th key={i} />
                    ))}
                </>
              ) : (
                <>
                  {expansion.isEnabled && expansion.variant === 'single' && rowIndex !== undefined && (
                    <Td {...propHelpers.getSingleExpandButtonTdProps({ item, rowIndex })} />
                  )}
                  {selection.isEnabled && rowIndex !== undefined && (
                    <Td {...propHelpers.getSelectCheckboxTdProps({ item, rowIndex })} />
                  )}
                  {children}
                </>
              )
            ) : null}
          </Tr>
        )
      ),
    [activeItem.isEnabled, activeItem.activeItemId]
  );
  TrWithBatteries.displayName = 'TrWithBatteries';
  return TrWithBatteries;
};
