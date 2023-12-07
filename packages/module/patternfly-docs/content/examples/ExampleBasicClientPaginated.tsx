import React from 'react';
import { ToolbarContent, EmptyState, EmptyStateIcon, Title } from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/esm/icons/cubes-icon';
import { useClientTableBatteries, ConditionalTableBody, FilterType } from '@patternfly-labs/react-table-batteries';

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

export const ExampleBasicClientPaginated: React.FunctionComponent = () => {
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

  const batteries = useClientTableBatteries({
    persistTo: 'urlParams',
    persistenceKeyPrefix: 't1', // The first Things table on this page.
    idProperty: 'id', // The name of a unique string or number property on the data items.
    items: mockApiResponse.data, // The generic type `TItem` is inferred from the items passed here.
    isLoading: isLoadingMockData,
    variant: 'compact',
    columnNames: {
      // The keys of this object define the inferred generic type `TColumnKey`. See "Unique Identifiers".
      name: 'Name',
      description: 'Description'
    },
    filter: {
      isEnabled: true,
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
          placeholderText: 'Filter by description...',
          getItemValue: (thing) => thing.description || ''
        }
      ]
    },
    sort: {
      isEnabled: true,
      sortableColumns: ['name', 'description'],
      getSortValues: (thing) => ({
        name: thing.name || '',
        description: thing.description || ''
      }),
      initialSort: { columnKey: 'name', direction: 'asc' }
    },
    pagination: { isEnabled: true }
  });

  // Here we destructure some of the properties from `batteries` for rendering.
  // Later we also spread the entire `batteries` object onto components whose props include subsets of it.
  const {
    currentPageItems, // These items have already been paginated.
    // `numRenderedColumns` is based on the number of columnNames and additional columns needed for
    // rendering controls related to features like selection, expansion, etc.
    // It is used as the colSpan when rendering a full-table-wide cell.
    numRenderedColumns,
    // The components provided here wrap the PF components with built-in props based on table state.
    components: { Table, Thead, Tr, Th, Tbody, Td, Toolbar, FilterToolbar, PaginationToolbarItem, Pagination }
  } = batteries;

  return (
    <>
      <Toolbar>
        <ToolbarContent>
          <FilterToolbar id="client-paginated-example-filters" />
          {/* You can render whatever other custom toolbar items you may need here! */}
          <PaginationToolbarItem>
            <Pagination variant="top" isCompact widgetId="client-paginated-example-pagination" />
          </PaginationToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <Table aria-label="Example things table">
        <Thead>
          <Tr isHeaderRow>
            <Th columnKey="name" />
            <Th columnKey="description" />
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
              <Tr key={thing.id} item={thing} rowIndex={rowIndex}>
                <Td width={30} columnKey="name">
                  {thing.name}
                </Td>
                <Td width={70} columnKey="description">
                  {thing.description}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </ConditionalTableBody>
      </Table>
      <Pagination variant="bottom" isCompact widgetId="client-paginated-example-pagination" />
    </>
  );
};
