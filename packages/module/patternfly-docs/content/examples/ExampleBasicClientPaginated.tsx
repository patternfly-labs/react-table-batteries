import React from 'react';
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  EmptyState,
  EmptyStateIcon,
  Title,
  Pagination
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import {
  useLocalTableControls,
  TableHeaderContentWithControls,
  ConditionalTableBody,
  TableRowContentWithControls,
  FilterToolbar,
  FilterType
} from '@patternfly-labs/react-table-batteries';

export const ExampleBasicClientPaginated: React.FunctionComponent = () => {
  // In a real table, this API data would come from a server fetch via something like react-query.
  interface Thing {
    id: number;
    name: string;
    description: string;
  }
  const isLoadingThings = false;
  const isErrorLoadingThings = false;
  const things: Thing[] = [
    { id: 1, name: 'Thing 1', description: 'Something from the API' },
    { id: 2, name: 'Thing 2', description: 'Something else from the API' }
  ];

  const tableControls = useLocalTableControls({
    persistTo: 'urlParams',
    persistenceKeyPrefix: 't1',
    idProperty: 'id', // The name of a unique string or number property on the data items.
    items: things, // The generic type `TItem` is inferred from the items passed here.
    columnNames: {
      // The keys of this object define the inferred generic type `TColumnKey`. See "Unique Identifiers".
      name: 'Name',
      description: 'Description'
    },
    isFilterEnabled: true,
    isSortEnabled: true,
    isPaginationEnabled: true,
    // Because isFilterEnabled is true, TypeScript will require these filterCategories:
    filterCategories: [
      {
        key: 'name',
        title: 'Name',
        type: FilterType.search,
        placeholderText: 'Filter by name...',
        getItemValue: (thing) => thing.name || ''
      }
    ],
    // Because isSortEnabled, TypeScript will require these sort-related properties:
    sortableColumns: ['name', 'description'],
    getSortValues: (thing) => ({
      name: thing.name || '',
      description: thing.description || ''
    }),
    initialSort: { columnKey: 'name', direction: 'asc' },
    isLoading: isLoadingThings
  });

  // Here we destructure some of the properties from `tableControls` for rendering.
  // Later we also spread the entire `tableControls` object onto components whose props include subsets of it.
  const {
    currentPageItems, // These items have already been paginated.
    // `numRenderedColumns` is based on the number of columnNames and additional columns needed for
    // rendering controls related to features like selection, expansion, etc.
    // It is used as the colSpan when rendering a full-table-wide cell.
    numRenderedColumns,
    // The objects and functions in `propHelpers` correspond to the props needed for specific PatternFly or Tackle
    // components and are provided to reduce prop-drilling and make the rendering code as short as possible.
    propHelpers: {
      toolbarProps,
      filterToolbarProps,
      paginationToolbarItemProps,
      paginationProps,
      tableProps,
      getThProps,
      getTrProps,
      getTdProps
    }
  } = tableControls;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} />
          {/* You can render whatever other custom toolbar items you may need here! */}
          <ToolbarItem {...paginationToolbarItemProps}>
            <Pagination variant="top" isCompact {...paginationProps} />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table {...tableProps} aria-label="Example things table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableControls}>
              <Th {...getThProps({ columnKey: 'name' })} />
              <Th {...getThProps({ columnKey: 'description' })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isLoadingThings}
          isError={isErrorLoadingThings}
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
              <Tr key={thing.id} {...getTrProps({ item: thing })}>
                <TableRowContentWithControls {...tableControls} item={thing} rowIndex={rowIndex}>
                  <Td width={30} {...getTdProps({ columnKey: 'name' })}>
                    {thing.name}
                  </Td>
                  <Td width={70} {...getTdProps({ columnKey: 'description' })}>
                    {thing.description}
                  </Td>
                </TableRowContentWithControls>
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" isCompact {...paginationProps} />
    </>
  );
};
