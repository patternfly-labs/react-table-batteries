import { DiscriminatedArgs } from '../../type-utils';
import { IFeaturePersistenceArgs } from '../../types';
import { objectKeys } from '../../utils';
import { usePersistentState } from '../generic/usePersistentState';

/**
 * A map of item ids (strings resolved from `item[idProperty]`) to either:
 * - a `columnKey` if that item's row has a compound-expanded cell
 * - or a boolean:
 *   - true if the row is expanded (for single-expand)
 *   - false if the row and all its cells are collapsed (for both single-expand and compound-expand).
 */
export type TExpandedCells<TColumnKey extends string> = Record<string, TColumnKey | boolean>;

/**
 * The "source of truth" state for the expansion feature.
 * - Included in the object returned by useTableState (ITableState) under the `expansionState` property.
 * - Also included in the `ITableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see ITableState
 * @see ITableBatteries
 */
export interface ExpansionState<TColumnKey extends string> {
  /**
   * A map of item ids to a `columnKey` or boolean for the current expansion state of that cell/row
   * @see TExpandedCells
   */
  expandedCells: TExpandedCells<TColumnKey>;
  /**
   * Updates the `expandedCells` map (replacing the entire map).
   * - See `expansionDerivedState` for helper functions to expand/collapse individual cells/rows.
   * @see IExpansionDerivedState
   */
  setExpandedCells: (newExpandedCells: TExpandedCells<TColumnKey>) => void;
}

/**
 * Args for useExpansionState
 * - Makes up part of the arguments object taken by useTableState (IUseTableStateArgs)
 * - The properties defined here are only required by useTableState if isExpansionEnabled is true (see DiscriminatedArgs)
 * - Properties here are included in the `ITableBatteries` object returned by useTablePropHelpers and useClientTableBatteries.
 * @see IUseTableStateArgs
 * @see DiscriminatedArgs
 * @see ITableBatteries
 */
export type ExpansionStateArgs = DiscriminatedArgs<
  'isExpansionEnabled',
  {
    /**
     * Whether to use single-expand or compound-expand behavior
     * - "single" for the entire row to be expandable with one toggle.
     * - "compound" for multiple cells in a row to be expandable with individual toggles.
     */
    expandableVariant: 'single' | 'compound';
  }
>;

/**
 * Provides the "source of truth" state for the expansion feature.
 * - Used internally by useTableState
 * - Takes args defined above as well as optional args for persisting state to a configurable storage target.
 * @see PersistTarget
 */
export const useExpansionState = <TColumnKey extends string, TPersistenceKeyPrefix extends string = string>(
  args: IExpansionStateArgs & IFeaturePersistenceArgs<TPersistenceKeyPrefix> = {}
): IExpansionState<TColumnKey> => {
  const { isExpansionEnabled, persistTo = 'state', persistenceKeyPrefix } = args;

  // We won't need to pass the latter two type params here if TS adds support for partial inference.
  // See https://github.com/konveyor/tackle2-ui/issues/1456
  const [expandedCells, setExpandedCells] = usePersistentState<
    TExpandedCells<TColumnKey>,
    TPersistenceKeyPrefix,
    'expandedCells'
  >({
    isEnabled: !!isExpansionEnabled,
    defaultValue: {},
    persistenceKeyPrefix,
    // Note: For the discriminated union here to work without TypeScript getting confused
    //       (e.g. require the urlParams-specific options when persistTo === "urlParams"),
    //       we need to pass persistTo inside each type-narrowed options object instead of outside the ternary.
    ...(persistTo === 'urlParams'
      ? {
          persistTo,
          keys: ['expandedCells'],
          serialize: (expandedCellsObj) => {
            if (!expandedCellsObj || objectKeys(expandedCellsObj).length === 0) {
              return { expandedCells: null };
            }
            return { expandedCells: JSON.stringify(expandedCellsObj) };
          },
          deserialize: ({ expandedCells: expandedCellsStr }) => {
            try {
              return JSON.parse(expandedCellsStr || '{}');
            } catch (e) {
              return {};
            }
          }
        }
      : persistTo === 'localStorage' || persistTo === 'sessionStorage'
      ? {
          persistTo,
          key: 'expandedCells'
        }
      : { persistTo })
  });
  return { expandedCells, setExpandedCells };
};
