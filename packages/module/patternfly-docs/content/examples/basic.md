---
# Sidenav top-level section
# should be the same for all markdown files
section: extensions
# Sidenav secondary level section
# should be the same for all markdown files
id: React table batteries
# Tab (react | react-demos | html | html-demos | design-guidelines | accessibility)
source: react
# If you use typescript, the name of the interface to display props for
# These are found through the sourceProps function provided in patternfly-docs.source.js
propComponents: ['ExtendedButton']
---

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
useTableControlProps,
useTableControlState,
TableHeaderContentWithControls,
ConditionalTableBody,
TableRowContentWithControls,
FilterToolbar,
FilterType,
FilterValue,
IActiveSort,
IFilterState,
IPaginationState,
ISortState,
ExtendedButton
} from '@patternfly-labs/react-table-batteries';

## Introduction

These hooks and components are intended as the missing "batteries" for the composable PatternFly Table. When PatternFly deprecated the "batteries included" legacy monolith Table in favor of the newer composable Table components, the price of the improved flexibility was that the table itself can no longer manage its own state and its usage became more verbose with more required boilerplate code. This trade-off was worth it for PatternFly because the composability offered by the new components is so crucial. However, we can have the best of both worlds by encapsulating the boilerplate logic into hooks that feed props into the composable components without abstracting those components away.

The react-table-batteries hooks and components provide a pattern where:

- Table-related state and business logic is encapsulated in hooks with simple configuration.
- JSX for rendering table components is shortened via the use of "prop helpers" returned by the hooks.
- Interactions like filtering, pagination, sorting and more can be handled automatically on an opt-in basis.
- Filtering/pagination/sorting logic can run on either the client or a server with the same configuration and JSX.
- You retain full control over the JSX, can override any prop and have access to all the state at any level.
- Strict type safety and support for generics provide a safe and convenient TypeScript development experience.

This pattern makes tables easier to build, maintain and enhance. Your code will be shorter and more readable without sacrificing composability or refactorability. You'll gain back some of the magic that used to be abstracted away in the deprecated table, but you don't have to sacrifice any of the benefits gained by migrating away from it. You'll also gain powerful and easily-enabled new features that the deprecated table never had.

## Basic examples

### Client-side filtering/sorting/pagination

For client-paginated tables, the only hook you need is `useLocalTableControls`. All arguments can be passed to it in one object, and the `tableControls` object returned by it contains everything you need to render the composable table. See [Which hooks/functions do I need?](#which-hooksfunctions-do-i-need).

This simple example includes only the filtering, sorting and pagination features and excludes arguments and properties related to the other features (see [Features](#features)).

Features are enabled by passing `is[Feature]Enabled` boolean arguments. Required arguments for the enabled features will be enforced by TypeScript based on which features are enabled. All features are disabled by default; for this basic example with filtering, sorting and pagination, we must pass true values for `isFilterEnabled`, `isSortEnabled` and `isPaginationEnabled`.

This example also shows a powerful optional capability of these hooks: the `persistTo` argument. This can be passed to either `useTableControlState` or `useLocalTableControls` and it allows us to store the current pagination/sort/filter state in a custom location and use that as the source of truth. The supported `persistTo` values are `'state'` (default), `'urlParams'` (recommended), `'localStorage'` or `'sessionStorage'`. For more on each option see [Custom state persistence targets](#custom-state-persistence-targets).

Here we use `persistTo: 'urlParams'` which will store and update the table state in the browser's URL query parameters. We also pass an optional `persistenceKeyPrefix` which distinguishes this persisted state from any other state that may be persisted in the URL by other tables on the same page (it can be omitted if there is only one table on the page). It should be a short string because it is included as a prefix on every URL param name. We'll use `'t1'` for the first table on the page that contains Thing objects.

Because our state is persisted in the page URL, we can reload the browser or press the Back and Forward buttons without losing our current filter, sort, and pagination selections. You can try it now: Apply a sort or filter to the table below, then navigate to the [design guidelines](design-guidelines) tab or any other page and click the browser Back button. You can even bookmark the page and all that state will be restored when loading the bookmark!

Note that the filtering/sorting/pagination business logic in this example happens inside `useLocalTableControls`. If you want to perform that logic on a server, see the basic example [Server-side filtering/sorting/pagination](#server-side-filteringsortingpagination). If you want to perform that logic on the client yourself, see the advanced example [Bringing your own client-side filtering/sorting/pagination logic](#bringing-your-own-client-side-filteringsortingpagination-logic).

```js file="./ExampleBasicClientPaginated.tsx"

```

### Server-side filtering/sorting/pagination

The usage is similar here, but some client-specific arguments are no longer required (like `getSortValues` and the `getItemValue` property of the filter category) and we break up the arguments object passed to `useLocalTableControls` into two separate objects passed to `useTableControlState` and `useTableControlProps` based on when they are needed. See [Which hooks/functions do I need?](#which-hooksfunctions-do-i-need) Note that the object passed to the latter contains all the properties of the object returned by the former in addition to things derived from the fetched API data. All of the arguments passed to both `useTableControlState` and `useTableControlProps` as well as the return values from both are included in the `tableControls` object returned by `useTableControlProps` (and by `useLocalTableControls` above). This way, we have one big object we can pass around to any components or functions that need any of the configuration, state, derived state, or props present on it, and we can destructure/reference them from a central place no matter where they came from.

Note that the `tableControlState` object returned by `useTableControlState` contains a `cacheKey` string property which changes any time the user interacts with filter, sort or pagination controls. Here we use it as a `useEffect` dependency to ensure the mock data is refetched accordingly. This value can also be used to cache data views we've already seen and avoid unnecessary fetches (see [Caching](#caching)).

Note also: the destructuring of `tableControls` and returned JSX in this example **_is identical to the client-based example above_**. The only differences between client-paginated and server-paginated tables are in the hook calls; the `tableControls` object and its usage are always the same.

```js file="./ExampleBasicServerPaginated.tsx"

```

## Advanced examples

The basic usage above and feature usage examples below (see [Features](#features)) should be sufficient for most tables. However, there are some less-frequently used options available:

### Custom state persistence targets

As described in [the first example](#client-side-filteringsortingpagination) above, the state used by each feature (see [Features](#features)) can be stored either in React state (default), in the browser's URL query parameters (recommended), or in the browser's `localStorage` or `sessionStorage`. If URL params are used, the user's current filters, sort, pagination state, expanded/active rows and more are preserved when reloading the browser, using the browser Back and Forward buttons, or loading a bookmark. The storage target for each feature is specified with the `persistTo` property. The supported `persistTo` values are:

- `'state'` (default) - Plain React state. Resets on component unmount or page reload.
- `'urlParams'` (recommended) - URL query parameters. Persists on page reload, browser history buttons (back/forward) or loading a bookmark. Resets on page navigation.
- `'localStorage'` - Browser localStorage API. Persists semi-permanently and is shared across all tabs/windows. Resets only when the user clears their browsing data.
- `'sessionStorage'` - Browser sessionStorage API. Persists on page/history navigation/reload. Resets when the tab/window is closed.

Passing one of these values as a string will set the persistence target for all features (as is done in the [Basic examples](#basic-examples) examples above). If you want to persist the state for some features in different storage than others, you can instead pass an object with features as keys and one of the above strings as each feature's value. The `default` key can be used to set the persistence target for any features not included in your object, and the keys for features are `'filter' | 'sort' | 'pagination' | 'selection' | 'expansion' | 'activeItem'`.

This example persists state for all features to URL parameters except filter state which is persisted in localStorage (resets only when clearing browsing data) and pagination state which is stored in React state (resets when reloading the page).

```js file="./ExampleAdvancedPersistTargets.tsx"

```

### Caching to prevent redundant data fetches

When using server-side filtering/sorting/pagination, we need to refetch the API data any time the user interacts with the filtering/sorting/pagination controls. We do this by fetching new data when the `tableControlState.cacheKey` value changes, by using it as a dependency in a fetch effect or by other means. However, let's say the user applies a filter and then clears that filter. We'll fetch the unfiltered data, then fetch the filtered data, then fetch the unfiltered data again! For each fetch, the user is shown a spinner and must wait.

If we introduce a caching layer that reuses previous data when fetching with the same `cacheKey` value, we prevent this third fetch/loading state. When the user clears their filters or restores the original sort/pagination state the data will update instantly as it is retrieved from the cache. You can try it now: try clicking the sort toggles in the headers of each column a few times. You'll notice that the first time a specific sort is applied to a column we need to ask the server to sort the data again by refetching data and showing a spinner. However, if we have fetched data with that sort applied already (it's not the first time you're viewing it) the data will not be refetched and you'll get the results of the original fetch instantly. You'll see fewer spinners the longer you interact with the table.

The easiest way to achieve this caching behavior is to use a data fetching library with caching support built in. For example, when using react-query's `useQuery` hook, you can use the `tableControlState.cacheKey` as part of your `queryKey` value and you'll get these benefits for free. Here we implement our own cache instead (not recommended) for demonstration purposes.

```js file="./ExampleAdvancedCaching.tsx"

```

### Bringing your own state

TODO this example will come in a separate PR - the
TODO don't use useTableControlState, but use getLocalTableControlDerivedState
TODO remark on how this may be helpful for incremental adoption

```js file="./ExampleAdvancedBYOState.tsx"

```

### Bringing your own client-side filtering/sorting/pagination logic

TODO this example will come in a separate PR
TODO useTableControlState, but perform filtering/sorting/pagination inline before useTableControlProps
TODO remark on how this may be helpful for incremental adoption
TODO remark on how it is similar to the [basic server-side example](#server-side-filteringsortingpagination) except performing the logic in the component instead of on a mock server.

```js file="./ExampleAdvancedBYOLogic.tsx"

```

### Bringing your own state and logic (use prop helpers only)

TODO this example will come in a separate PR
TODO remark on how all the state management and built-in logic provided by `useTableControlState` and `useLocalTableControls` is optional, and if you want your table to handle all its own business logic you can still benefit from useTableControlProps to make rendering easier.
TODO remark on how this may be helpful as the first step in incremental adoption, followed by adopting `useTableControlState` and then maybe `getLocalTableControlDerivedState` or the full `useLocalTableControls` (as in the [basic client-side example](#client-side-filteringsortingpagination)).

```js file="./ExampleAdvancedBYOStateAndLogic.tsx"

```

## Features

The functionality and state of the table-batteries hooks is broken down into the following features. Each of these features represents a slice of the logical concerns for a table UI.

Note that the filtering, sorting and pagination features are special because they must be performed in a specific order to work correctly: filter and sort data, then paginate it. Using the table-batteries hooks like `useLocalTableControls` or `useTableControlState` and `useTableControlProps` will take care of this for you (see [Basic examples](#basic-examples) and [Which hooks/functions do I need?](#which-hooksfunctions-do-i-need)), but if you are handling filtering/sorting/pagination yourself

### Filtering

TODO this example will come in a separate PR
TODO add a version of the basic client table example with only filtering enabled
TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureFilter.tsx"

```

### Sorting

TODO this example will come in a separate PR
TODO add a version of the basic client table example with only sorting enabled
TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureSort.tsx"

```

### Pagination

TODO this example will come in a separate PR
TODO add a version of the basic client table example with only pagination enabled
TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeaturePagination.tsx"

```

### Selection

TODO this example will come in a separate PR
TODO add a version of the basic client table example with only selection enabled
TODO copy over and rework things from OLD_DOCS.md here
TODO flesh this out when useSelectionState has been moved to this repo

```js file="./ExampleFeatureSelection.tsx"

```

### Expansion (single-expand variant)

TODO this example will come in a separate PR
TODO add a version of the basic client table example with only single-expand enabled
TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureExpansionSingle.tsx"

```

### Expansion (compound-expand variant)

TODO this example will come in a separate PR
TODO add a version of the basic client table example with only compound-expand enabled
TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureExpansionCompound.tsx"

```

### Active Item

TODO this example will come in a separate PR
TODO add a version of the basic client table example with only active-item enabled
TODO should we copy over PageDrawer code? or just some text with the active item name above the table?
TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureActiveItem.tsx"

```

### Kitchen sink example (all features enabled)

TODO this example will come in a separate PR
TODO add a version of the basic client table example with all of the above features enabled
TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleKitchenSink.tsx"

```

## Usage notes

### Should I use client or server logic?

If the API endpoints you're using support server-side pagination parameters, it is generally a good idea to use them for better performance and scalability. If you do use server-side pagination, you'll need to also use server-side filtering and sorting if you are enabling those features.

If your API does not support these parameters or you need to have the entire collection of items in memory at once for some other reason, you'll need a client-paginated table.

### Which hooks/functions do I need?

In most cases, you'll only need to use these higher-level hooks and helpers to build a table:

- For client-paginated tables: `useLocalTableControls` is all you need.
  - Internally it uses `useTableControlState`, `useTableControlProps` and the `getLocalTableControlDerivedState` helper. The config arguments object is a combination of the arguments required by `useTableControlState` and `useTableControlProps`.
  - The return value (an object we generally name `tableControls`) has everything you need to render your table. Give it a `console.log` to see what is available.
- For server-paginated tables: `useTableControlState`, `getHubRequestParams`, and `useTableControlProps`.
  - Choose whether you want to use React state (default), URL params (recommended), localStorage or sessionStorage as the source of truth, and call `useTableControlState` with the appropriate `persistTo` option and optional `persistenceKeyPrefix` (to namespace persisted state for multiple tables on the same page).
    - `persistTo` can be `'state' | 'urlParams' | 'localStorage' | 'sessionStorage'`, and defaults to `'state'` if omitted (falls back to regular React state).
    - You can also use a different type of storage for the state of each feature by passing an object for `persistTo`. See [Custom state persistence targets](#custom-state-persistence-targets).
  - Take the object returned by that hook (generally named `tableControlState`) and pull out the parameters you need for your API fetch from the `filterState`, `sortState` and `paginationState` properties. Fetch your filtered/sorted/paginated API data using these values.
  - Set up your API client to refetch data when the `tableControlState.cacheKey` string changes. This will ensure that when the user interacts with filter, sort or pagination controls the data will update accordingly. If your data fetching implementation supports caching by key (for example, the `queryKey` option in react-query) you can use this `cacheKey` value as part of that key to prevent re-fetching data for a filter/sort/pagination view you've already fetched. See the advanced example [Caching to prevent redundant data fetches](#caching-to-prevent-redundant-data-fetches).
  - Call `useTableControlProps` and pass it an object spreading all properties from `tableControlState` along with additional config arguments. Some of these arguments will be derived from your API data fetch, such as `currentPageItems`, `totalItemCount` and `isLoading`. Others are simply passed here rather than above because they are used only for rendering and not required for state management.
  - The return value (the same `tableControls` object returned by `useLocalTableControls`) has everything you need to render your table. Give it a `console.log` to see what is available or reference [the `ITableControls` type in the `types.ts` file](https://github.com/mturley/react-table-batteries/blob/main/packages/module/src/types.ts#L263).

### Incremental adoption

TODO reference advanced examples

### Item objects, not row objects

Because using react-table-batteries involves passing in API data and configuration which is used to infer the types of other arguments, it can be helpful to understand how the relevant TypeScript types and properties are used internally. A few of the most important details are explained here, but more on the implementation detail of these hooks can be found in CONTRIBUTING.md.

None of the code here treats "rows" as their own data structure. The content and style of a row is a presentational detail that should be limited to the JSX where rows are rendered. In implementations which use arrays of row objects (like the deprecated PatternFly table) those objects tend to duplicate API data with a different structure and the code must reason about two different representations of the data. Instead, this code works directly with arrays of "items" (the API data objects themselves) and makes all of an item's API object properties available where they might be needed without extra lookups. The consumer maps over item objects and derives row components from them only at render time.

An item object has the generic type `TItem`, which is inferred by TypeScript either from the type of the `items` array passed into `useLocalTableControls` (for client-paginated tables) or from the `currentPageItems` array passed into `useTableControlProps` (for server-paginated tables). For more, see the JSDoc comments in the `types.ts` file.

> ℹ️ CAVEAT: For server-paginated tables the item data is not in scope until after the API query hook is called, but the `useTableControlState` hook must be called _before_ API queries because its return values are needed to serialize filter/sort/pagination params for the API. This means the inferred `TItem` type is not available when passing arguments to `useTableControlState`. `TItem` resolves to `unknown` in this scope, which is usually fine since the arguments there don't need to know what type of items they are working with. If the item type is needed for any of these arguments it can be explicitly passed as a type param. However...
>
> ⚠️ TECH DEBT NOTE: TypeScript generic type param lists (example: `fn<This, List, Here>(args);`) are all-or-nothing (you must either omit the list and infer all generics for a function or pass them all explicitly). This means if you need to pass an explicit type for `TItem`, all other type params which are normally inferred must also be explicitly passed (including all of the `TColumnKey`s and `TFilterCategoryKey`s). This makes for some redundant code, although TypeScript will still enforce that it is all consistent. There is a possible upcoming TypeScript language feature which would allow partial inference in type param lists and may alleviate this in the future. See TypeScript pull requests [#26349](https://github.com/microsoft/TypeScript/pull/26349) and [#54047](https://github.com/microsoft/TypeScript/pull/54047), and the Konveyor issue [#1456](https://github.com/konveyor/tackle2-ui/issues/1456).

### Unique identifiers

#### Column keys

Table columns are identified by unique keys which are statically inferred from the keys of the `columnNames` object (used in many places via the inferred generic type `TColumnKey`. See the JSDoc comments in the `types.ts` file). Any state which keeps track of something by column (such as which columns are sorted and which columns are expanded in a compound-expandable row) uses these column keys as identifiers, and the user-facing column names can be looked up from the `columnNames` object anywhere a `columnKey` is present. Valid column keys are enforced via TypeScript generics; if a `columnKey` value is used that is not present in `columnNames`, you should get a type error.

#### Item IDs

Item objects must contain some unique identifier which is either a string or number. The property key of this identifier is a required config argument called `idProperty`, which will usually be `'id'` but could be something like `'uid'`, or `'name'` if your object names are unique. If no unique identifier is present in the API data, an artificial one should be injected before passing the data into these hooks. This can be done in your fetch implementation before data is returned, for example by using the `select` callback in react-query.

Any state which keeps track of something by item (i.e. by row) makes use of `item[idProperty]` as an identifier. Examples of this include selected items, expanded items and active items. Valid `idProperty` values are also enforced by TypeScript generics; if an `idProperty` is provided that is not a property on the `TItem` type, you should get a type error.
