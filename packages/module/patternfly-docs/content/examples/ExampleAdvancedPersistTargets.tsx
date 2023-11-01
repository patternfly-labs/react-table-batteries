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
  useClientTableBatteries,
  TableHeaderContentWithControls,
  ConditionalTableBody,
  TableRowContentWithControls,
  FilterToolbar,
  FilterType
} from '@patternfly-labs/react-table-batteries';

// This example table's rows represent Thing objects in our fake API.
interface Thing {
  id: number;
  name: string;
  description: string;
}

// This is a barebones mock API server to demonstrate fetching data.
// We use a timeout of 1000ms here to simulate the loading state when data is fetched.
interface MockAPIResponse {
  data: Thing[];
}
const fetchMockData = () =>
  new Promise<MockAPIResponse>((resolve) => {
    setTimeout(() => {
      const mockData: Thing[] = [
        { id: 1, name: 'Thing 01', description: 'Something from the API' },
        { id: 2, name: 'Thing 02', description: 'Something else from the API' }
      ];
      resolve({ data: mockData });
    }, 1000);
  });

export const ExampleAdvancedPersistTargets: React.FunctionComponent = () => {
  // In a real table we'd use a real API fetch here, perhaps using a library like react-query.
  const [mockApiResponse, setMockApiResponse] = React.useState<MockAPIResponse>({ data: [] });
  const [isLoadingMockData, setIsLoadingMockData] = React.useState(false);
  React.useEffect(() => {
    setIsLoadingMockData(true);
    fetchMockData().then((response) => {
      setMockApiResponse(response);
      setIsLoadingMockData(false);
    });
  }, []);

  const tableBatteries = useClientTableBatteries({
    persistTo: {
      default: 'urlParams',
      filter: 'localStorage',
      pagination: 'state'
    },
    persistenceKeyPrefix: 't3', // The third Things table on this page.
    idProperty: 'id', // The name of a unique string or number property on the data items.
    items: mockApiResponse.data, // The generic type `TItem` is inferred from the items passed here.
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
      },
      {
        key: 'description',
        title: 'Description',
        type: FilterType.search,
        placeholderText: 'Filter by description...'
      }
    ],
    // Because isSortEnabled is true, TypeScript will require these sort-related properties:
    sortableColumns: ['name', 'description'],
    getSortValues: (thing) => ({
      name: thing.name || '',
      description: thing.description || ''
    }),
    initialSort: { columnKey: 'name', direction: 'asc' },
    isLoading: isLoadingMockData
  });

  // Here we destructure some of the properties from `tableBatteries` for rendering.
  // Later we also spread the entire `tableBatteries` object onto components whose props include subsets of it.
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
  } = tableBatteries;

  return (
    <>
      <Toolbar {...toolbarProps}>
        <ToolbarContent>
          <FilterToolbar {...filterToolbarProps} id="persist-targets-example-filters" />
          {/* You can render whatever other custom toolbar items you may need here! */}
          <ToolbarItem {...paginationToolbarItemProps}>
            <Pagination variant="top" isCompact {...paginationProps} widgetId="persist-targets-example-pagination" />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table {...tableProps} aria-label="Example things table">
        <Thead>
          <Tr>
            <TableHeaderContentWithControls {...tableBatteries}>
              <Th {...getThProps({ columnKey: 'name' })} />
              <Th {...getThProps({ columnKey: 'description' })} />
            </TableHeaderContentWithControls>
          </Tr>
        </Thead>
        <ConditionalTableBody
          isLoading={isLoadingMockData}
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
                <TableRowContentWithControls {...tableBatteries} item={thing} rowIndex={rowIndex}>
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
      <Pagination variant="bottom" isCompact {...paginationProps} widgetId="persist-targets-example-pagination" />
    </>
  );
};
