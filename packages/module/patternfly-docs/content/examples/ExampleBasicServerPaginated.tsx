/* eslint-disable no-console */
import React from 'react';
import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Pagination,
  EmptyState,
  EmptyStateIcon,
  Title
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import {
  ConditionalTableBody,
  FilterToolbar,
  FilterType,
  TableHeaderContentWithControls,
  TableRowContentWithControls,
  useTableControlProps,
  useTableControlState
} from '@patternfly-labs/react-table-batteries';

export const ExampleBasicServerPaginated: React.FunctionComponent = () => {
  const tableControlState = useTableControlState({
    persistTo: 'urlParams',
    persistenceKeyPrefix: 't2',
    columnNames: {
      name: 'Name',
      description: 'Description'
    },
    isFilterEnabled: true,
    isSortEnabled: true,
    isPaginationEnabled: true,
    filterCategories: [
      {
        key: 'name',
        title: 'Name',
        type: FilterType.search,
        placeholderText: 'Filter by name...'
      }
    ],
    sortableColumns: ['name', 'description'],
    initialSort: { columnKey: 'name', direction: 'asc' }
  });

  // Here, we would fetch API data from the server using values from inside `tableControlState` as
  // parameters for passing filters, active sort column and direction, and pagination state to the server.
  // The fetched data should be made available here in such a way that when those parameters change in `tableControlState`
  // the data gets refetched automatically. A library like react-query or a custom fetch hook with useEffect both work here.
  // For this example, we'll mock the returned data. In a real app, useFetchThings might call useQuery from react-query.
  const useFetchThings = () => ({
    data: [
      { id: 1, name: 'Thing 1', description: 'Something from the API' },
      { id: 2, name: 'Thing 2', description: 'Something else from the API' }
    ],
    totalItemCount: 2,
    isLoading: false,
    isError: false
  });
  const { data, totalItemCount, isLoading: isLoadingThings, isError: isErrorLoadingThings } = useFetchThings();
  // TODO we need some way for the mocked API fetch to actually do the pagination/etc logic in this example
  // TODO maybe use mock-service-worker somehow? or just a minimal stub using promises?

  const tableControls = useTableControlProps({
    ...tableControlState,
    idProperty: 'id',
    currentPageItems: data,
    totalItemCount,
    isLoading: isLoadingThings,
    // TODO this shouldn't be necessary once we refactor useSelectionState to fit the rest of the table-batteries pattern.
    // Due to an unresolved issue, the `selectionState` is required here even though we're not using selection.
    // As a temporary workaround we pass stub values for these properties.
    selectionState: {
      selectedItems: [],
      isItemSelected: () => false,
      isItemSelectable: () => false,
      toggleItemSelected: () => {},
      selectMultiple: () => {},
      areAllSelected: false,
      selectAll: () => {},
      setSelectedItems: () => {}
    }
  });

  // Everything below is the same as the client-side example!

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
