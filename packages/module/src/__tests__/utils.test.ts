import { mergeArgs } from '../utils';

test('Deeply merges two args objects', () => {
  const a = {
    someTopLevelArgA: 'hello',
    filter: { someFilterArgA: 'hello' },
    sort: { someSortArgA: 'hello' },
    pagination: { somePaginationArgA: 'hello' },
    selection: { someSelectionArgA: 'hello' },
    expansion: { someExpansionArgA: 'hello' },
    activeItem: { someActiveItemArgA: 'hello' }
  };
  const b = {
    someTopLevelArgB: 'goodbye',
    filter: { someFilterArgB: 'goodbye' },
    sort: { someSortArgB: 'goodbye' },
    pagination: { somePaginationArgB: 'goodbye' },
    selection: { someSelectionArgB: 'goodbye' },
    expansion: { someExpansionArgB: 'goodbye' },
    activeItem: { someActiveItemArgB: 'goodbye' }
  };
  const merged = mergeArgs(a, b);
  expect(merged).toEqual({
    someTopLevelArgA: 'hello',
    someTopLevelArgB: 'goodbye',
    filter: { someFilterArgA: 'hello', someFilterArgB: 'goodbye' },
    sort: { someSortArgA: 'hello', someSortArgB: 'goodbye' },
    pagination: { somePaginationArgA: 'hello', somePaginationArgB: 'goodbye' },
    selection: { someSelectionArgA: 'hello', someSelectionArgB: 'goodbye' },
    expansion: { someExpansionArgA: 'hello', someExpansionArgB: 'goodbye' },
    activeItem: { someActiveItemArgA: 'hello', someActiveItemArgB: 'goodbye' }
  });
});

test('Tolerates missing feature sub-objects in either param or both params', () => {
  const a = {
    someTopLevelArgA: 'hello',
    filter: { someFilterArgA: 'hello' },
    sort: { someSortArgA: 'hello' },
    pagination: { somePaginationArgA: 'hello' },
    selection: { someSelectionArgA: 'hello' }
    // Missing expansion and activeItem
  };
  const b = {
    someTopLevelArgB: 'goodbye',
    filter: { someFilterArgB: 'goodbye' },
    sort: { someSortArgB: 'goodbye' },
    pagination: { somePaginationArgB: 'goodbye' },
    expansion: { someExpansionArgB: 'goodbye' }
    // Missing selection and activeItem
  };
  const merged = mergeArgs(a, b);
  expect(merged).toEqual({
    someTopLevelArgA: 'hello',
    someTopLevelArgB: 'goodbye',
    filter: { someFilterArgA: 'hello', someFilterArgB: 'goodbye' },
    sort: { someSortArgA: 'hello', someSortArgB: 'goodbye' },
    pagination: { somePaginationArgA: 'hello', somePaginationArgB: 'goodbye' },
    selection: { someSelectionArgA: 'hello' },
    expansion: { someExpansionArgB: 'goodbye' }
    // Missing activeItem
  });
});
