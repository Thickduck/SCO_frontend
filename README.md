# SmartCloud Optimizer

A React, TypeScript, and Vite frontend for reviewing cloud inventory, utilization, cost, and optimization opportunities.

## Run locally

1. In `SCO_backend`, install dependencies, seed the demo accounts and generated data, and start the API:

   ```sh
   npm install
   npm run seed
   npm start
   ```

   Seeding loads `simulator/generated/resources.csv` and `simulator/generated/metrics.csv` into DuckDB. The backend also imports them on startup when the files change.
2. In this directory, install dependencies and create the frontend environment file:

   ```sh
   npm install
   cp .env.example .env
   ```

3. Start the Vite development server:

   ```powershell
   npm run dev
   ```

The frontend uses the `VITE_API_URL` setting for the API base URL. It defaults to `http://localhost:5001/api` when the variable is not set. The backend must allow requests from the Vite origin.

To regenerate the simulator data, run `python simulator/simulator.py` from `SCO_backend`. The next backend startup detects the updated CSV files and refreshes the database tables.

Create an account through the registration page, or sign in with an account configured in the backend's local database. The frontend stores the bearer token in browser `localStorage`, validates restored sessions through `/api/auth/me`, and removes invalid sessions.

## Included workflows

- Authenticated sign-in and registration with field validation and password-strength feedback.
- Editable personal profiles and shared company details, with company changes restricted by backend admin authorization.
- Overview of monthly spend, inventory, alerts, forecasts, and pending recommendations.
- Resource inventory filters for region, environment, and owner, with resource details and utilization history.
- Resource-level utilization charts, p95/p99 metrics, and anomaly review.
- Dataset-driven recommendations for resources unattached and inactive across at least 14 days of metrics, and VMs with at least 14 days of data, p95/p99 CPU at or below 20%/30%, p95/p99 memory at or below 50%/60%, and no CPU or memory peaks above 90%. Individual and batch actions retain review status while a candidate remains eligible.
- Cost breakdowns by environment and owner, forecast projections, and before/after savings.
- Alert review, a what-if savings simulator, plain-language explanations, downloadable exports, and sustainability estimates.
- Persistent light and dark themes, responsive layouts, loading/error/empty states, and action feedback.

New databases seeded with `npm run seed` include an admin account: `admin@cloud.com` / `password123`. New accounts cannot grant themselves admin access; to grant an existing account access, update its `is_admin` flag in the DuckDB `users` table. The backend applies the `is_admin` column migration automatically when it starts against an existing database.

## Cost and safety notes

The interface displays estimates returned by the backend. Treat pricing and sustainability values as illustrative; actual costs and environmental impact depend on workload, provider pricing, and infrastructure. Orphaned-resource suggestions use the resource's listed monthly cost; right-sizing suggestions estimate savings as 25% of that cost. Review generated exports before using them, and validate resize recommendations against p95/p99 peaks and service-level requirements. Recommendations are review suggestions only and do not change cloud resources.

## Checks

```powershell
npm run build
npm run lint
```
