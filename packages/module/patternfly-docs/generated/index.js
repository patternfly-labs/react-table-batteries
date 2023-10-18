module.exports = {
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