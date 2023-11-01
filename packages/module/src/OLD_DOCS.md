# table-controls

TODO remove this file once all its useful content has moved to either the docs site, README.md or CONTRIBUTING.md

## Usage

### Kitchen sink example with per-feature state persistence and all features enabled

Here's an example of another server-computed table with all of the table-controls features enabled (see [Features](#features)). Note that if you wanted to make this example client-computed, you would pass all the new feature-specific properties seen here to `useLocalTableControls` instead of `useTableControlState`.

New features added here in addition to filtering, sorting and pagination are:

- Expansion - Each row has an expand toggle button to the left of its data (automatically injected by the `TableRowContentWithControls` component), which opens additional detail below the row. (this is the "single" expand variant, compound expansion is also supported). The `expandableVariant` option is required because `isExpansionEnabled` is true.
  - This makes the `getExpandedContentTdProps` propHelper and the `expansionDerivedState` object available on the `tableControls` object.
  - Each row is now contained in a `<Tbody>` component which pairs the existing `<Tr>` with another `<Tr>` containing that row's `<ExpandableRowContent>`.
- Active item - Rows have hover styles and are clickable (handled automatically by `getTrProps`). Clicking a row marks that row's item as "active", which can be used to open a drawer or whatever else is needed on the page. This is enabled by `isActiveItemEnabled`, which does not require any additional options.
  - This makes the `activeItemDerivedState` object available on the `tableControls` object.

> ⚠️ TECH DEBT NOTE: The selection feature is currently not enabled in this example because it is about to significantly change with a refactor. Currently to use selection you have to use the outdated `useSelectionState` from lib-ui and pass its return values to `useTableControlProps`. Once selection is moved into table-controls, it will be configurable alongside the other features in `useTableControlState` and added to this example.

> ⚠️ TECH DEBT NOTE: We should also add a compound-expand example, but that can maybe wait for the proper extension-seed docs in table-batteries after the code is moved there.

Here we'll also show an alternate way of using `persistTo`: separate persistence targets per feature. Let's say that for this table, we want the user's filters to persist in `localStorage` where they will be restored no matter what the user does, but we want the sort, pagination and other state to reset when we leave the page. We can do this by passing an object to `persistTo` instead of a string. We specify the default persistence target as React state with `default: "state"`, and override it for the filters with `filter: "localStorage"`.

```tsx
const tableControlState = useTableControlState({
  persistTo: {
    default: "state",
    filter: "localStorage",
  },
  persistenceKeyPrefix: "t",
  columnNames: {
    name: "Name",
    description: "Description",
  },
  isFilterEnabled: true,
  isSortEnabled: true,
  isPaginationEnabled: true,
  isExpansionEnabled: true,
  isActiveItemEnabled: true,
  filterCategories: [
    {
      key: "name",
      title: "Name",
      type: FilterType.search,
      placeholderText: "Filter by name...",
    },
  ],
  sortableColumns: ["name", "description"],
  initialSort: { columnKey: "name", direction: "asc" },
  expandableVariant: "single",
});

const hubRequestParams = getHubRequestParams({
  ...tableControlState,
  hubSortFieldKeys: {
    name: "name",
    description: "description",
  },
});

const { data, totalItemCount, isLoading, isError } =
  useFetchThings(hubRequestParams);

const tableControls = useTableControlProps({
  ...tableControlState,
  idProperty: "id",
  currentPageItems: data,
  totalItemCount,
  isLoading,
});

const {
  currentPageItems,
  numRenderedColumns,
  propHelpers: {
    toolbarProps,
    filterToolbarProps,
    paginationToolbarItemProps,
    paginationProps,
    tableProps,
    getThProps,
    getTrProps,
    getTdProps,
    getExpandedContentTdProps,
  },
  activeItemDerivedState: { activeItem, clearActiveItem },
  expansionDerivedState: { isCellExpanded },
} = tableControls;

return (
  <>
    <Toolbar {...toolbarProps}>
      <ToolbarContent>
        <FilterToolbar {...filterToolbarProps} id="kitchen-sink-example-filters" />
        <ToolbarItem {...paginationToolbarItemProps}>
          <SimplePagination
            idPrefix="example-things-table"
            isTop
            paginationProps={paginationProps}
          />
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
    <Table {...tableProps} aria-label="Example things table">
      <Thead>
        <Tr>
          <TableHeaderContentWithControls {...tableControls}>
            <Th {...getThProps({ columnKey: "name" })} />
            <Th {...getThProps({ columnKey: "description" })} />
          </TableHeaderContentWithControls>
        </Tr>
      </Thead>
      <ConditionalTableBody
        isLoading={isLoading}
        isError={isError}
        isNoData={currentPageItems.length === 0}
        noDataEmptyState={
          <EmptyState variant="sm">
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h2" size="lg">
              No things available
            </Title>
          </EmptyState>
        }
        numRenderedColumns={numRenderedColumns}
      >
        <Tbody>
          {currentPageItems?.map((thing, rowIndex) => (
            <Tbody key={thing.id} isExpanded={isCellExpanded(thing)}>
              <Tr {...getTrProps({ item: thing })}>
                <TableRowContentWithControls
                  {...tableControls}
                  item={thing}
                  rowIndex={rowIndex}
                >
                  <Td width={25} {...getTdProps({ columnKey: "name" })}>
                    {thing.name}
                  </Td>
                  <Td width={75} {...getTdProps({ columnKey: "description" })}>
                    {thing.description}
                  </Td>
                </TableRowContentWithControls>
              </Tr>
              {isCellExpanded(thing) && (
                <Tr isExpanded>
                  <Td />
                  <Td {...getExpandedContentTdProps({ item: thing })}>
                    <ExpandableRowContent>
                      Some extra detail about thing {thing.name} goes here!
                    </ExpandableRowContent>
                  </Td>
                </Tr>
              )}
            </Tbody>
          ))}
        </Tbody>
      </ConditionalTableBody>
    </Table>
    <SimplePagination
      idPrefix="example-things-table"
      isTop={false}
      paginationProps={paginationProps}
    />
    {/* Stub example of something custom you might render based on the `activeItem`. Source not included. */}
    <ThingDetailDrawer
      thingId={activeItem?.id || null}
      onCloseClick={clearActiveItem}
    />
  <>
);
```

## Features

All of the hooks and helpers described in this section are used internally by the higher-level hooks and helpers, and do not need to be used directly (see [Usage](#usage)).

### Filtering

Items are filtered according to user-selected filter key/value pairs.

- Keys and filter types (search, select, etc) are defined by the `filterCategories` array config argument. The `key` properties of each of these `FilterCategory` objects are the source of truth for the inferred generic type `TFilterCategoryKeys` (For more, see the JSDoc comments in the `types.ts` file).
- Filter state is provided by `useFilterState`.
- For client-side filtering, the filter logic is provided by `getLocalFilterDerivedState` (based on the `getItemValue` callback defined on each `FilterCategory` object, which is not required when using server-side filtering).
- For server-side filtering, filter state is serialized for the API by `getFilterHubRequestParams`.
- Filter-related component props are provided by `useFilterPropHelpers`.
- Filter inputs and chips are rendered by the `FilterToolbar` component.

> ⚠️ TECH DEBT NOTE: The `FilterToolbar` component and `FilterCategory` type predate the table-controls pattern (they are tackle2-ui legacy code) and are not located in this directory. The abstraction there may be a little too opaque and it does not take full advantage of TypeScript generics. We may want to adjust that code to better fit these patterns and move it here.

### Sorting

Items are sorted according to the user-selected sort column and direction.

- Sortable columns are defined by a `sortableColumns` array of `TColumnKey` values (see [Unique Identifiers](#unique-identifiers)).
- Sort state is provided by `useSortState`.
- For client-side sorting, the sort logic is provided by `getLocalSortDerivedState` (based on the `getSortValues` config argument, which is not required when using server-side sorting).
- For server-side sorting, sort state is serialized for the API by `getSortHubRequestParams`.
- Sort-related component props are provided by `useSortPropHelpers`.
- Sort inputs are rendered by the table's `Th` PatternFly component.

### Pagination

Items are paginated according to the user-selected page number and items-per-page count.

- The only config argument for pagination is the optional `initialItemsPerPage` which defaults to 10.
- Pagination state is provided by `usePaginationState`.
- For client-side pagination, the pagination logic is provided by `getLocalPaginationDerivedState`.
- For server-side pagination, pagination state is serialized for the API by `getPaginationHubRequestParams`.
- Pagination-related component props are provided by `usePaginationPropHelpers`.
- A `useEffect` call which prevents invalid state after an item is deleted is provided by `usePaginationEffects`. This is called internally by `usePaginationPropHelpers`.
- Pagination inputs are rendered by our `SimplePagination` component which is a thin wrapper around the PatternFly `Pagination` component.

> ⚠️ TECH DEBT NOTE: The `SimplePagination` component also predates the table-controls pattern (legacy tackle2-ui code). We probably don't even need it and should remove it.

> ⚠️ TECH DEBT NOTE: Is usePaginationPropHelpers the best place to call usePaginationEffects? Should we make the consumer call it explicitly?

### Expansion

Item details can be expanded, either with a "single expansion" variant where an entire row is expanded to show more detail or a "compound expansion" variant where an individual cell in a row (one at a time per row) is expanded. This is tracked in state by a mapping of item ids (derived from the `idProperty` config argument) to either a boolean value (for single expansion) or a `columnKey` value (for compound expansion). See [Unique Identifiers](#unique-identifiers) for more on `idProperty` and `columnKey`.

- Single or compound expansion is defined by the optional `expandableVariant` config argument which defaults to `"single"`.
- Expansion state is provided by `useExpansionState`.
- Expansion shorthand functions are provided by `getExpansionDerivedState`.
- Expansion is never managed server-side.
- Expansion-related component props are provided by `useExpansionPropHelpers`.
- Expansion inputs are rendered by the table's `Td` PatternFly component and expanded content is managed at the consumer level by conditionally rendering a second row with full colSpan inside a PatternFly `Tbody` component. The `numRenderedColumns` value returned by `useTableControlProps` can be used for the correct colSpan here.

### Active Item

A row can be clicked to mark its item as "active", which usually opens a drawer on the page to show more detail. Note that this is distinct from expansion (toggle arrows) and selection (checkboxes) and these features can all be used together. Active item state is simply a single id value (number or string) for the active item, derived from the `idProperty` config argument (see [Unique Identifiers](#unique-identifiers)).

- The active item feature requires no config arguments.
- Active item state is provided by `useActiveItemState`.
- Active item shorthand functions are provided by `getActiveItemDerivedState`.
- Active-item-related component props are provided by `useActiveItemPropHelpers`.
- A `useEffect` call which prevents invalid state after an item is deleted is provided by `useActiveItemEffects`. This is called internally in `useActiveItemPropHelpers`.

> ⚠️ TECH DEBT NOTE: Is useActiveItemPropHelpers the best place to call useActiveItemEffects? Should we make the consumer call it explicitly?

### Selection

Items can be selected with checkboxes on each row or with a bulk select control that provides actions like "select all", "select none" and "select page". The list of selected item ids in state can be used to perform bulk actions like Delete.

> ⚠️ TECH DEBT NOTE: Currently, selection state has not yet been refactored to be a part of the table-controls pattern and we are still relying on [the old `useSelectionState` from lib-ui](https://migtools.github.io/lib-ui/?path=/docs/hooks-useselectionstate--checkboxes) which dates back to older migtools projects. The return value of this legacy `useSelectionState` is required by `useTableControlProps`. Mike is working on a refactor to bring selection state hooks into this directory.
