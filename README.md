# Artillery Reporter Dashboard

This project is a web-based dashboard for analyzing and designing load tests using [Artillery](https://www.artillery.io/), a popular open-source tool for performance and load testing of web applications and APIs.

## Features

- **Analyze Artillery Reports:**
  - Upload an `artillery report.json` file (generated after running a load test with Artillery).
  - Visualize key performance metrics and trends with interactive graphs and tables.
  - See summary cards, endpoint breakdowns, error rates, latency, throughput, and scenario completion rates.
  - All metrics are explained with tooltips for easy understanding.
- **Compare Two Reports:**
  - Upload two reports and compare them side-by-side.
  - See overlayed charts and a summary table highlighting which system performed better for each metric.
  - At the end of the comparison summary, a line automatically states which system configuration behaved better overall.
- **Design Artillery Configs:**
  - Use a friendly UI to build your own Artillery test configuration (YAML) without writing code.
  - Set the target URL, add/remove test phases, enable plugins, and more.
- **Menu Preferences with Persistence:**
  - Menu settings (dark mode, config designer, comparison mode) are saved in your browser’s localStorage and restored automatically.
- **Internationalization:**
  - Switch between English and Spanish in the UI.

---

## Understanding the Dashboard

- **Summary Cards:** Show total requests, responses, errors, throughput, Apdex, data transferred, session length, and latency (mean/p95/max).
- **Endpoint Latency Breakdown Table:** Shows per-endpoint stats (requests, mean, p95, max, min).
- **Graphs:** Requests/responses over time, response time percentiles, request rate, Apdex, error rate, throughput, and scenario completion.
- **Scenario Completion Chart:** Visualizes completed vs failed user scenarios.
- **Comparison Dashboard:** Overlayed charts and a summary table with tooltips for each metric. A final line states which system performed better.

---

## How to Use

1. Run an Artillery test and generate a `report.json` file.
2. Upload the file in the "Analyze Report" tab to see your results.
3. Use the "Design Config" tab to create new test scenarios visually.
4. To compare two systems, upload two reports in comparison mode.

---

## Technical Details

- **Frontend:** React (TypeScript) with Vite.
- **UI:** Material UI (MUI).
- **Charts:** Recharts.
- **YAML Generation:** js-yaml.
- **Type Safety:** All Artillery report/config structures are strongly typed.
- **Persistent Preferences:** Custom `useLocalStorage` React hook for menu state.
- **Tooltips:** All comparison metrics have tooltips explaining their meaning.
- **Comparison Summary:** Automatically determines and displays which system performed better.

---

## Development

- **Install dependencies:** `pnpm install`
- **Start dev server:** `pnpm dev`
- **Build for production:** `pnpm run build`
- **Lint:** `pnpm lint`

---

For more, see the source code and comments in each component.

---

To generate a report:

```
artillery run asciiart-load-test.yml --output report.json
artillery run jsonplaceholder-test.yml --output report1.json
```