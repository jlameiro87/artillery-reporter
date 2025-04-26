# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# Artillery Reporter Dashboard

This project is a web-based dashboard for analyzing and designing load tests using [Artillery](https://www.artillery.io/), a popular open-source tool for performance and load testing of web applications and APIs.

## What does this project do?

- **Analyze Artillery Reports:**
  - Upload an `artillery report.json` file (generated after running a load test with Artillery).
  - Visualize key performance metrics and trends with interactive graphs and tables.
- **Design Artillery Configs:**
  - Use a friendly UI to build your own Artillery test configuration (YAML) without writing code.
  - Set the target URL, add/remove test phases, enable plugins, and more.

---

## Understanding the Dashboard (for non-experts)

When you upload a report, the dashboard shows several graphs and tables to help you understand how your website or API performed under load. Here’s what each section means:

### 1. **Summary Cards**
- **Total Requests:** How many HTTP requests were sent during the test.
- **Total Responses:** How many responses were received from the server.
- **Errors:** The number of requests that did not get a valid response.
- **Throughput (req/s):** How many requests per second were sent (higher is better for most systems).
- **Apdex:** A user satisfaction score (1.0 is best, 0 is worst). Shows how many users had a good experience.
- **Data Transferred:** Total amount of data downloaded during the test.
- **Session Length (mean):** Average time a simulated user spent in a session.
- **Latency (mean/p95/max):** How long it took for the server to respond (average, 95th percentile, and slowest response).

### 2. **Endpoint Latency Breakdown Table**
- Shows how each API endpoint or URL performed.
- For each endpoint, you see:
  - **Requests:** How many times it was called.
  - **Mean:** Average response time.
  - **P95:** 95% of requests were faster than this time.
  - **Max/Min:** Slowest and fastest response times.

### 3. **Graphs**
- **Requests & Responses Over Time:**
  - Shows how many requests were sent and responses received in each time period. Helps spot spikes or drops in traffic.
- **Response Time Percentiles:**
  - Shows how fast the server responded for most users (p50/median, p90, p99). Lower is better.
- **Request Rate & Apdex:**
  - Shows how many requests per second were sent and how satisfied users were (Apdex).

---

## Why is this useful?
- **No performance testing experience needed:** The dashboard explains each metric in simple terms.
- **Find bottlenecks:** Quickly see if your site/API slows down under load, and which endpoints are slowest.
- **Design tests visually:** Build new load test configs without writing YAML or code.

---

## How to use
1. Run an Artillery test and generate a `report.json` file.
2. Upload the file in the "Analyze Report" tab to see your results.
3. Use the "Design Config" tab to create new test scenarios visually.

---

For more about Artillery, see the [official docs](https://www.artillery.io/docs/reference/test-script).

---

## Technical Details (for developers and advanced users)

### Project Structure
- **Frontend:** React (TypeScript) with Vite for fast development and production builds.
- **UI Framework:** Material UI (MUI) for consistent, accessible, and responsive design.
- **Charts:** Recharts for interactive, customizable data visualizations.
- **YAML Generation:** js-yaml for converting config objects to YAML format.
- **Type Safety:** All Artillery report and config structures are strongly typed in `src/types/artillery.ts`.
- **Code Splitting:** Vite and Rollup are configured to split vendor and feature chunks for optimal loading.

### Key Components
- `App.tsx`: Main entry point, handles navigation, file upload, and state management.
- `components/SummaryCards.tsx`: Displays key stats in a responsive card layout.
- `components/EndpointTable.tsx`: Renders a table of per-endpoint latency and request stats.
- `components/DashboardCharts.tsx`: Renders all main charts (requests/responses, percentiles, Apdex, etc.).
- `components/ConfigDesigner.tsx`: Visual editor for building Artillery config YAML files.
- `types/artillery.ts`: TypeScript interfaces for all Artillery report/config data structures.
- `utility/common.ts`: (For shared utility functions, if any.)

### Data Flow
- **Report Analysis:**
  - User uploads a `report.json` file (Artillery output).
  - The file is parsed and stored in React state.
  - Helper functions extract aggregate stats, endpoint breakdowns, and time-series data for charts.
  - All data is rendered with type safety and user-friendly formatting.
- **Config Designer:**
  - Uses React state to build a config object.
  - UI allows adding/removing phases, toggling plugins, and editing core config fields.
  - The config object is converted to YAML in real time for preview and export.

### Performance & Build
- **Vite** is used for fast HMR and optimized production builds.
- **Rollup manualChunks** in `vite.config.ts` splits React, MUI, and Recharts into separate chunks for better caching and faster initial loads.
- **TypeScript** is used throughout for maintainability and reliability.

### Extensibility
- **Add new metrics:** Extend the helper functions in `App.tsx` and add new cards, table columns, or chart series as needed.
- **Support more Artillery features:** Expand `ConfigDesigner.tsx` to support more plugins, scenarios, or advanced YAML options.
- **API integration:** The architecture supports future integration with backend APIs for storing or running tests.

### Artillery Report Structure
- The dashboard expects the standard Artillery JSON report format, which includes:
  - `aggregate`: Overall test summary (counters, rates, histograms)
  - `intermediate`: Array of per-interval stats for time-series analysis
- All parsing and rendering is type-safe and robust to missing or partial data.

### Example Type Definitions (see `src/types/artillery.ts`)
```ts
export interface ArtilleryReport {
  aggregate?: ArtilleryAggregate;
  intermediate?: ArtilleryIntermediateEntry[];
}
export interface ArtilleryAggregate {
  counters: { [key: string]: number };
  rates: { [key: string]: number };
  histograms: { [key: string]: ArtilleryHistogram };
}
// ...
```

### Development
- **Install dependencies:** `pnpm install`
- **Start dev server:** `pnpm dev`
- **Build for production:** `pnpm run build`
- **Lint:** `pnpm lint`

---

For more, see the source code and comments in each component.