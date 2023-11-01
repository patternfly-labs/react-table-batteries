module.exports = {
  '/extensions/table-batteries/design-guidelines': {
    id: "Table batteries",
    title: "Table batteries",
    toc: [{"text":"Header"},[{"text":"Sub-header"}]],
    section: "extensions",
    subsection: "",
    source: "design-guidelines",
    tabName: null,
    Component: () => import(/* webpackChunkName: "extensions/table-batteries/design-guidelines/index" */ './extensions/table-batteries/design-guidelines')
  },
  '/extensions/table-batteries/react': {
    id: "Table batteries",
    title: "Table batteries",
    toc: [{"text":"Introduction"},{"text":"Basic examples"},[{"text":"Client-side filtering/sorting/pagination"},{"text":"Server-side filtering/sorting/pagination"}],{"text":"Advanced examples"},[{"text":"Custom state persistence targets"},{"text":"Caching to prevent redundant data fetches"},{"text":"Bringing your own state"},{"text":"Bringing your own client-side filtering/sorting/pagination logic"},{"text":"Bringing your own state and logic (use prop helpers only)"}],{"text":"Features"},[{"text":"Filtering"},{"text":"Sorting"},{"text":"Pagination"},{"text":"Selection"},{"text":"Expansion (single-expand variant)"},{"text":"Expansion (compound-expand variant)"},{"text":"Active Item"},{"text":"Kitchen sink example (all features enabled)"}],{"text":"Usage notes"},[{"text":"The tableBatteries object"},{"text":"Should I use client or server logic?"},{"text":"Which hooks/functions do I need?"},{"text":"Incremental adoption"},{"text":"Item objects, not row objects"},{"text":"Unique identifiers"}]],
    examples: ["Client-side filtering/sorting/pagination","Server-side filtering/sorting/pagination","Custom state persistence targets","Caching to prevent redundant data fetches","Bringing your own state","Bringing your own client-side filtering/sorting/pagination logic","Bringing your own state and logic (use prop helpers only)","Filtering","Sorting","Pagination","Selection","Expansion (single-expand variant)","Expansion (compound-expand variant)","Active Item","Kitchen sink example (all features enabled)"],
    section: "extensions",
    subsection: "",
    source: "react",
    tabName: null,
    Component: () => import(/* webpackChunkName: "extensions/table-batteries/react/index" */ './extensions/table-batteries/react')
  },
  '/extensions/patternfly-react-table-batteries-extension/design-guidelines': {
    id: "PatternFly React table batteries extension",
    title: "PatternFly React table batteries extension",
    toc: [{"text":"Header"},[{"text":"Sub-header"}]],
    section: "extensions",
    subsection: "",
    source: "design-guidelines",
    tabName: null,
    Component: () => import(/* webpackChunkName: "extensions/patternfly-react-table-batteries-extension/design-guidelines/index" */ './extensions/patternfly-react-table-batteries-extension/design-guidelines')
  },
  '/extensions/patternfly-react-table-batteries-extension/react': {
    id: "PatternFly React table batteries extension",
    title: "PatternFly React table batteries extension",
    toc: [{"text":"Basic usage"},[{"text":"Example"},{"text":"Fullscreen example"}]],
    examples: ["Example"],
    fullscreenExamples: ["Fullscreen example"],
    section: "extensions",
    subsection: "",
    source: "react",
    tabName: null,
    Component: () => import(/* webpackChunkName: "extensions/patternfly-react-table-batteries-extension/react/index" */ './extensions/patternfly-react-table-batteries-extension/react')
  }
};