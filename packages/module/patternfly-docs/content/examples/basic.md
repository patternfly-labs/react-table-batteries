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

import { ExtendedButton } from "@patternfly-labs/react-table-batteries";

## Why?

These hooks and components are intended as the missing "batteries" for the composable PatternFly Table. When PatternFly deprecated the "batteries included" legacy monolith Table in favor of the newer composable Table components, the price of the improved flexibility was that the table itself can no longer manage its own state and its usage became more verbose with more required boilerplate code. This trade-off was worth it for PatternFly because the composability offered by the new components is so crucial. However, we can have the best of both worlds by encapsulating the boilerplate logic into hooks that feed props into the composable components without abstracting those components away.

The react-table-batteries hooks and components provide a pattern where:

- Table-related state and business logic is encapsulated in hooks with simple configuration.
- JSX for rendering table components is shortened via the use of "prop helpers" returned by the hooks.
- Interactions like filtering, pagination, sorting and more can be handled automatically on an opt-in basis.
- Filtering/pagination/sorting logic can run on either the client or a server with the same configuration and JSX.
- You retain full control over the JSX, can override any prop and have access to all the state at any level.
- Strict type safety and support for generics provide a safe and convenient TypeScript development experience.

With this pattern, tables are easy to build and maintain with code that is short and readable without sacrificing composability or refactorability. You'll gain back some of the magic that used to be abstracted away in the deprecated table, but you don't have to sacrifice any of the benefits gained by migrating away from it. You'll also gain powerful and easily-enabled new features that the deprecated table never had.

## Basic usage

### Example table with client-side filtering/sorting/pagination

```js file="./ExampleBasicClientPaginated.tsx"

```

### Example table with server-side filtering/sorting/pagination

```js file="./ExampleBasicServerPaginated.tsx"

```

## Advanced usage

### State persistence targets

The state used by each feature (see [Features](#features)) can be stored either in React state (default), in the browser's URL query parameters (recommended), or in the browser's `localStorage` or `sessionStorage`. If URL params are used, the user's current filters, sort, pagination state, expanded/active rows and more are preserved when reloading the browser, using the browser Back and Forward buttons, or loading a bookmark. The storage target for each feature is specified with the `persistTo` property. The supported `persistTo` values are:

- `"state"` (default) - Plain React state. Resets on component unmount or page reload.
- `"urlParams"` (recommended) - URL query parameters. Persists on page reload, browser history buttons (back/forward) or loading a bookmark. Resets on page navigation.
- `"localStorage"` - Browser localStorage API. Persists semi-permanently and is shared across all tabs/windows. Resets only when the user clears their browsing data.
- `"sessionStorage"` - Browser sessionStorage API. Persists on page/history navigation/reload. Resets when the tab/window is closed.

Passing one of these values as a string will set the persistence target for all features (as is done in the [Basic usage](#basic-usage) examples above). If you want to persist the state for some features in different storage than others, you can instead pass an object with features as keys and one of the above strings as each feature's value. The `default` key can be used to set the persistence target for any features not included in your object.

This example persists state for all features to URL parameters except filter state which is persisted in localStorage.

```ts
persistTo={{ default: "urlParams", filter: "localStorage" }}
```

```js file="./ExampleAdvancedPersistTargets.tsx"

```

## Features

The functionality and state of the table-batteries hooks is broken down into the following features. Each of these features represents a slice of the logical concerns for a table UI.

Note that the filtering, sorting and pagination features are special because they must be performed in a specific order to work correctly: filter and sort data, then paginate it. Using the higher-level hooks like `useLocalTableControls` or `useTableControlState` + `useTableControlProps` will take care of this for you (see [Basic usage](#basic-usage)), but if you are handling filtering/sorting/pagination yourself with the lower-level hooks you'll need to be mindful of this order.

### Filter

TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureFilter.tsx"

```

### Sort

TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureSort.tsx"

```

### Pagination

TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeaturePagination.tsx"

```

### Selection

TODO - flesh this out when useSelectionState has been moved here

```js file="./ExampleFeatureSelection.tsx"

```

### Expansion

TODO copy over and rework things from OLD_DOCS.md here

#### Single-expand variant

```js file="./ExampleFeatureExpansionSingle.tsx"

```

#### Compound-expand variant

```js file="./ExampleFeatureExpansionCompound.tsx"

```

### Active Item

TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleFeatureActiveItem.tsx"

```

### Kitchen Sink example (all features enabled)

TODO copy over and rework things from OLD_DOCS.md here

```js file="./ExampleKitchenSink.tsx"

```

## Which Hooks/Functions Do I Need?

In most cases, you'll only need to use these higher-level hooks and helpers to build a table:

- For client-paginated tables: `useLocalTableControls` is all you need.
  - Internally it uses `useTableControlState`, `useTableControlProps` and the `getLocalTableControlDerivedState` helper. The config arguments object is a combination of the arguments required by `useTableControlState` and `useTableControlProps`.
  - The return value (an object we generally name `tableControls`) has everything you need to render your table. Give it a `console.log` to see what is available.
- For server-paginated tables: `useTableControlState`, `getHubRequestParams`, and `useTableControlProps`.
  - Choose whether you want to use React state, URL params or localStorage/sessionStorage as the source of truth, and call `useTableControlState` with the appropriate `persistTo` option and optional `persistenceKeyPrefix` (to namespace persisted state for multiple tables on the same page).
    - `persistTo` can be `"state" | "urlParams" | "localStorage" | "sessionStorage"`, and defaults to `"state"` if omitted (falls back to regular React state).
    - You can also use a different type of storage for the state of each feature by passing an object for `persistTo`. See [State persistence targets](#state-persistence-targets).
  - Take the object returned by that hook (generally named `tableControlState`) and pass it to the `getHubRequestParams` function (you may need to spread it and add additional properties like `hubSortFieldKeys`). (⚠️ TECH DEBT NOTE: This is Konveyor-specific)
  - Call your API query hooks, using the `hubRequestParams` as needed.
  - Call `useTableControlProps` and pass it an object spreading all properties from `tableControlState` along with additional config arguments. Some of these arguments will be derived from your API data, such as `currentPageItems`, `totalItemCount` and `isLoading`. Others are simply passed here rather than above because they are used only for rendering and not required for state management.
  - The return value (the same `tableControls` object returned by `useLocalTableControls`) has everything you need to render your table. Give it a `console.log` to see what is available.

If desired, you can use lower-level feature-specific hooks on their own (for example, if you really only need pagination and you're not rendering a full table). For a full list of the lower-level hooks, see CONTRIBUTING.md. (TODO -- should we just make examples with this? it's not recommended. maybe just ditch it) However, if you are using more than one or two of them you may want to consider using these higher-level hooks even if you don't need all the features. You can omit the config arguments for any features you don't need and then just don't use the relevant `propHelpers`.

## Important Data Structure Notes

Because using react-table-batteries involves passing in API data and configuration which is used to infer the types of other arguments, it can be helpful to understand how the relevant TypeScript types and properties are used internally. A few of the most important details are explained here, but more on the implementation detail of these hooks can be found in CONTRIBUTING.md.

### Item Objects, Not Row Objects

None of the code here treats "rows" as their own data structure. The content and style of a row is a presentational detail that should be limited to the JSX where rows are rendered. In implementations which use arrays of row objects (like the deprecated PatternFly table) those objects tend to duplicate API data with a different structure and the code must reason about two different representations of the data. Instead, this code works directly with arrays of "items" (the API data objects themselves) and makes all of an item's API object properties available where they might be needed without extra lookups. The consumer maps over item objects and derives row components from them only at render time.

An item object has the generic type `TItem`, which is inferred by TypeScript either from the type of the `items` array passed into `useLocalTableControls` (for client-paginated tables) or from the `currentPageItems` array passed into `useTableControlProps` (for server-paginated tables). For more, see the JSDoc comments in the `types.ts` file.

> ℹ️ CAVEAT: For server-paginated tables the item data is not in scope until after the API query hook is called, but the `useTableControlState` hook must be called _before_ API queries because its return values are needed to serialize filter/sort/pagination params for the API. This means the inferred `TItem` type is not available when passing arguments to `useTableControlState`. `TItem` resolves to `unknown` in this scope, which is usually fine since the arguments there don't need to know what type of items they are working with. If the item type is needed for any of these arguments it can be explicitly passed as a type param. However...
>
> ⚠️ TECH DEBT NOTE: TypeScript generic type param lists (example: `fn<This, List, Here>(args);`) are all-or-nothing (you must either omit the list and infer all generics for a function or pass them all explicitly). This means if you need to pass an explicit type for `TItem`, all other type params which are normally inferred must also be explicitly passed (including all of the `TColumnKey`s and `TFilterCategoryKey`s). This makes for some redundant code, although TypeScript will still enforce that it is all consistent. There is a possible upcoming TypeScript language feature which would allow partial inference in type param lists and may alleviate this in the future. See TypeScript pull requests [#26349](https://github.com/microsoft/TypeScript/pull/26349) and [#54047](https://github.com/microsoft/TypeScript/pull/54047), and our issue [#1456](https://github.com/konveyor/tackle2-ui/issues/1456).

### Unique Identifiers

#### Column keys

Table columns are identified by unique keys which are statically inferred from the keys of the `columnNames` object (used in many places via the inferred generic type `TColumnKey`. See the JSDoc comments in the `types.ts` file). Any state which keeps track of something by column (such as which columns are sorted and which columns are expanded in a compound-expandable row) uses these column keys as identifiers, and the user-facing column names can be looked up from the `columnNames` object anywhere a `columnKey` is present. Valid column keys are enforced via TypeScript generics; if a `columnKey` value is used that is not present in `columnNames`, you should get a type error.

#### Item IDs

Item objects must contain some unique identifier which is either a string or number. The property key of this identifier is a required config argument called `idProperty`, which will usually be `"id"`. If no unique identifier is present in the API data, an artificial one can be injected before passing the data into these hooks, which can be done in the useQuery `select` callback (see instances where we have used `"_ui_unique_id"`). Any state which keeps track of something by item (i.e. by row) makes use of `item[idProperty]` as an identifier. Examples of this include selected rows, expanded rows and active rows. Valid `idProperty` values are also enforced by TypeScript generics; if an `idProperty` is provided that is not a property on the `TItem` type, you should get a type error.

> ⚠️ TECH DEBT NOTE: Things specific to `useQuery` and `_ui_unique_id` here are Konveyor-specific notes that should be removed after moving this to table-batteries.

### Should I Use Client or Server Logic?

If the API endpoints you're using support server-side pagination parameters, it is generally a good idea to use them for better performance and scalability. If you do use server-side pagination, you'll need to also use server-side filtering and sorting.

If the endpoints do not support these parameters or you need to have the entire collection of items in memory at once for some other reason, you'll need a client-paginated table. It is also slightly easier to implement a client-paginated table.
