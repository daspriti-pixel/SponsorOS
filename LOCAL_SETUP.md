# SponsorOS – local frontend checkpoint

This is the original GitHub export with the three placeholder routes replaced (Growth Analytics with Experiments and Simulator tabs, Task Manager, Data Explorer). Existing TanStack Start structure and original UI components are preserved. No live database writes or AI requests are performed by these changes. The local browser store remains the data source; historical campaign aggregates are snapshot-only. Simulation campaign analytics use available mock deal rows; the simulated CRM has incomplete sample brands. Login, Supabase integration, real source rows, payment schedule reconciliation and live AI remain pending. Experiment thresholds and scenario inputs follow the supplied planning README; observations are initially unavailable. Existing localStorage may contain older mock experiment values; use a fresh browser profile for baseline testing. Do not clear live data.

## Windows / VS Code
1. Extract this ZIP to a NEW folder. Keep the original ZIP unchanged.
2. Open the extracted folder containing package.json in VS Code.
3. Open Terminal > New Terminal. Check `node -v` and `npm -v`. Use a current Node LTS (at least 22.12 for Vite 8; dependency requirements may be higher).
4. Run `npm install` then `npm run dev`. Open the local URL printed in the terminal.
5. In a second terminal run `npm test` and `npm run build`. If dependency installation fails, retain the error output; do not use --force blindly. The original Lovable package versions and configuration are retained.
6. Open Growth Analytics, switch tabs, verify three forecasts, switch Growth Simulation, create a local task, open Data Explorer and export a sample CSV.

Validation here: TypeScript transpilation (syntax) of changed routes/types/mock and standalone numerical assertions for scenario totals, allocated budget and evidence gates. Full npm installation, type checking, browser workflows and build have not been verified in the execution environment. Existing hydration warnings remain uninvestigated.
