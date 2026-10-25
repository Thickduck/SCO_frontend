# SmartCloud Optimizer

A React, TypeScript, and Vite frontend for reviewing cloud inventory, utilization, cost, and optimization opportunities.

## Run locally

1. In `SCO_backend`, install dependencies, seed the demo accounts and generated data, and start the API:

   ```sh
   python simulator/simulator.py
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
- Engineer, finance, and leadership workspace navigation with role-focused pages. This remains a single shared demo workspace, not tenant-isolated data.
- Editable personal profiles and shared company details, with company changes restricted by backend admin authorization.
- Overview of monthly spend, inventory, alerts, forecasts, and pending recommendations.
- Resource inventory filters for region, environment, and owner, with resource details and utilization history.
- Fleet-wide CPU, memory, disk, and network utilization, filters by region/environment/team, full 30-day resource history, p95/p99 metrics, and anomaly review.
- Dataset-driven recommendations for unattached resources and idle VMs. VM resizing requires at least 14 days of data, p95/p99 CPU at or below 20%/30%, p95/p99 memory at or below 50%/60%, no CPU or memory peaks above 90%, and at least 4 vCPU. Targets halve vCPU and RAM while preserving disk. Off-hours schedules require measured p95 CPU at or below 10% and memory at or below 30%. Review status does not apply infrastructure changes.
- Cost breakdowns by environment and owner, utilization-trend forecasts, configurable monthly budget alerts, and before/after estimates capped at each resource's listed monthly cost.
- Data-backed utilization/capacity/budget alerts, a recommendation-driven what-if simulator, local rule-based explanations, live inventory CSV and review-only IaC exports, and illustrative sustainability estimates.
- A checked-in assumptions sheet at `SCO_backend/simulator/assumptions.json`, alongside generated dataset assumptions.
- Persistent light and dark themes, responsive layouts, loading/error/empty states, and action feedback.

New databases seeded with `npm run seed` include an admin account: `admin@cloud.com` / `password123`. New accounts cannot grant themselves admin access; to grant an existing account access, update its `is_admin` flag in the DuckDB `users` table. The backend applies the `is_admin` column migration automatically when it starts against an existing database.

## Cost and safety notes

The simulator's INR prices are illustrative, not provider quotes. Forecasts compare the previous 7 days with the latest 7 days of price-weighted utilization and are not a billing feed. Sustainability values apply the explicit factors in the assumptions sheet to pending estimated savings. Review generated exports before using them, validate resizing against workload peaks and service-level requirements, and validate off-hours schedules against overnight jobs and availability needs. Recommendation actions only record review status; this prototype does not connect to a cloud provider or change resources.

## Checks

```powershell
npm run build
npm run lint
```
