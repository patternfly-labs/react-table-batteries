import React from 'react';
import { TABLE_FEATURES, TableBatteries, TableFeature } from './types';
import { MergedArgs } from './type-utils';

/**
 * Works around problems caused by event propagation when handling a clickable element that contains other clickable elements.
 * - Used internally by useTablePropHelpers for the active item feature, but is generic and could be used outside tables.
 * - When a click event happens within a row, checks if there is a clickable element in between the target node and the row element.
 *   (For example: checkboxes, buttons or links).
 * - Prevents triggering the row click behavior when inner clickable elements or their children are clicked.
 */
export const handlePropagatedRowClick = <E extends React.KeyboardEvent | React.MouseEvent>(
  event: E | undefined,
  onRowClick: (event: E) => void
) => {
  // This recursive parent check is necessary because the event target could be,
  // for example, the SVG icon inside a button rather than the button itself.
  const isClickableElementInTheWay = (element: Element): boolean => {
    if (['input', 'button', 'a'].includes(element.tagName.toLowerCase())) {
      return true;
    }
    if (!element.parentElement || element.parentElement?.tagName.toLowerCase() === 'tr') {
      return false;
    }
    return isClickableElementInTheWay(element.parentElement);
  };
  if (event?.target instanceof Element && !isClickableElementInTheWay(event.target)) {
    onRowClick(event);
  }
};

export const objectKeys = <T extends object>(obj: T) => Object.keys(obj) as (keyof T)[];

export const parseMaybeNumericString = (numOrStr: string | undefined | null): string | number | null => {
  if (numOrStr === undefined || numOrStr === null) {
    return null;
  }
  const num = Number(numOrStr);
  return isNaN(num) ? numOrStr : num;
};

export const mergeArgs = <
  A extends Partial<Record<TableFeature, object>>,
  B extends Partial<Record<TableFeature, object>>,
  TIncludedFeatures extends TableFeature = TableFeature
>(
  a: A,
  b: B
): MergedArgs<A, B, TIncludedFeatures> => {
  const merged = { ...a, ...b };
  TABLE_FEATURES.forEach((feature) => {
    if (b[feature]) {
      merged[feature] = { ...a[feature], ...b[feature] };
    }
  });
  return merged as MergedArgs<A, B, TIncludedFeatures>;
};

export const getTableBatteryDefaults = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(): {
  [key in TableFeature]: Omit<
    Required<TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>>[key],
    'isEnabled' | 'persistTo'
  >;
} => ({
  filter: {
    filterCategories: [],
    filterValues: {},
    setFilterValues: () => {}
  },
  sort: {
    sortableColumns: [],
    activeSort: null,
    setActiveSort: () => {}
  },
  pagination: {
    pageNumber: 1,
    setPageNumber: () => {},
    itemsPerPage: 10,
    setItemsPerPage: () => {}
  },
  selection: {
    isItemSelectable: () => false,
    selectedItemIds: [],
    setSelectedItemIds: () => {},
    selectedItems: [],
    isItemSelected: () => false,
    allSelected: false,
    pageSelected: false,
    selectItem: () => {},
    selectItems: () => {},
    selectAll: () => {},
    selectPage: () => {},
    selectNone: () => {},
    setSelectedItems: () => {}
  },
  expansion: {
    variant: 'single',
    expandedCells: {},
    setExpandedCells: () => {},
    isCellExpanded: () => false,
    setCellExpanded: () => {}
  },
  activeItem: {
    activeItemId: null,
    setActiveItemId: () => {},
    activeItem: null,
    setActiveItem: () => {},
    clearActiveItem: () => {},
    isActiveItem: () => false
  }
});
