import React from 'react';
import { TABLE_FEATURES, TableBatteries, TableFeature } from './types';

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

export const mergeFeatureSubObjects = <
  A extends Partial<Record<TableFeature, object>>,
  B extends Partial<Record<TableFeature, object>>
>(
  a: A,
  b: B
): Omit<A, TableFeature> & Omit<B, TableFeature> & Partial<{ [key in TableFeature]: A[key] & B[key] }> => {
  const merged = { ...a, ...b };
  TABLE_FEATURES.forEach((feature) => {
    if (b[feature]) {
      merged[feature] = { ...a[feature], ...b[feature] };
    }
  });
  return merged;
};

// TODO finish this
export const getFeatureDefaults = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(): {
  [key in TableFeature]: Partial<
    TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>[key]
  >;
} => ({
  filter: {
    filterCategories: []
  },
  sort: {},
  pagination: {},
  selection: {},
  expansion: {},
  activeItem: {}
});

// TODO fill in defaults for a full batteries object here
// TODO this could probably be a loop over TABLE_FEATURES using the defaults object above
export const withFeatureDefaults = <
  TPartialBatteries extends Partial<
    TableBatteries<TItem, TColumnKey, TSortableColumnKey, TFilterCategoryKey, TPersistenceKeyPrefix>
  >,
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey,
  TFilterCategoryKey extends string = string,
  TPersistenceKeyPrefix extends string = string
>(
  partialBatteries: TPartialBatteries
): TPartialBatteries & Required<Pick<TPartialBatteries, TableFeature>> => ({
  ...partialBatteries,
  filter: {
    filterCategories: [],
    ...partialBatteries.filter
  },
  sort: {},
  pagination: {},
  selection: {},
  expansion: {},
  activeItem: {}
});
