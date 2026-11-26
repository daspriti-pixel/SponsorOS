# SponsorOS

**From Prospect to Payment**  
RISA Labs Growth APM Assignment · Challenge B: Sponsorship Growth  
Candidate: Priti Das · Proposed host city: Kolkata, India

**[Live application](https://sponsoros.sponsoros-app.workers.dev)** · **[Source repository](https://github.com/Soumya0409-ju/SponsorOS)**

> Release status — 26 November 2026: deployed to Cloudflare Workers; the user confirmed the public website opens and works. Supabase authentication, default historical and simulation dashboard values and historical Copilot responses were verified locally. The final production build and GitHub push succeeded. Some database write workflows, simulation AI responses and AI task confirmation were deliberately not tested end to end. All event data is synthetic; forecasts are assumptions, not actual sponsorship receipts.

## Evaluator quick start

1. Open the live application and sign in using the dedicated demo credentials supplied privately with the submission. No installation is required. If repository access is restricted, the candidate must grant the evaluator access separately.
2. In **Historical** mode select **11 April 2025**. Review the Command Center and Growth Analytics: ₹20L confirmed cash commitments, 24 partnerships against a target of 28 and ₹10.5L advanced open cash pipeline. Historical cash receipts are unavailable.
3. Switch to **Growth Simulation**, select **15 March 2027** and review Revenue & Collections: ₹13.5L verified *simulated* receipts against the ₹24L base target; ₹2.8L overdue. The simulation is editable and shared by anyone using the same demo account.
4. Open Growth Analytics to inspect campaign performance, the five experiments and the three forecasting scenarios. Use the sliders for a temporary what-if forecast; forecasts do not change receipts.
5. Inspect the Sponsors, Deal Pipeline, Task Manager and Data Explorer pages. Prefer read-only inspection of the baseline; any saved changes alter the simulation.
6. Optional: in Historical mode ask AI Copilot “What is preventing us from achieving our target?” This workflow was verified locally. In Simulation mode, a task proposal can be requested and explicitly confirmed, but this complete workflow remains unverified. AI requests are subject to provider availability and quota.

Demo credentials are not stored in this README or the source repository. Use a project-only account with a unique password, seeded simulation records and no personal data; share access privately, not on an unrestricted public page.

## 1. Problem and product objective

CampusFest is a fictional college festival. The goal is to maximize sponsorship cash **actually received before the festival**, within limited time, budget and staffing. Confirmed cash commitments, in-kind support and verified receipts are distinct measures. A sponsorship agreement alone does not finance the event until payment is received.

SponsorOS is designed as a sponsorship growth command center combining analytics, campaign management, deal tracking, revenue collection, experiments and an embedded AI analyst. The intended workflow is **measure → diagnose → decide → execute → measure again**.

The North Star Metric is pre-festival cash collected (INR). Supporting metrics include signed cash deals, average commitment, outstanding and overdue payments, qualified meetings, proposal conversion, budget utilization and experiment performance.

## 2. Market research and sponsor selection

Kolkata is the proposed host city because of its college festival culture, student audience, regional commercial ecosystem and opportunities to leverage alumni and professional networks. The historical dataset also supports prioritizing relationship-driven acquisition. This is a qualitative city choice, not a measured Kolkata market-size estimate.

| Segment | Illustrative prospects (not confirmed sponsors) | Commercial motivation | Activation idea | Prospecting quota |
|---|---|---|---|---:|
| Consumer products | ITC non-tobacco brands, Emami, Nestlé | Awareness and product trials | Sampling and branded events | 40 |
| Food and beverage | WOW! Momo, Amul, Red Bull | Trials and sales | Food experience zone | 45 |
| Mobility | Rapido, Uber, TVS | Customer acquisition | Trackable mobility codes | 30 |
| Education and EdTech | Career Launcher, TIME | Student leads | Career workshops | 35 |
| Banking and FinTech | Bandhan Bank, SBI, PhonePe | Youth engagement | Financial literacy activity | 25 |
| Fashion and lifestyle | Lux Cozi, Max Fashion | Brand awareness | Branded merchandise | 25 |
| Technology | ASUS, HP, boAt | Product discovery | Tech or gaming zone | 25 |
| Personal care | Nivea, Emami | Product discovery | Sampling | 20 |
| Media and entertainment | Radio Mirchi, PVR INOX | Audience engagement | Entertainment partnership | 20 |
| Regional businesses | Local restaurants, gyms, retailers | Local customers | Associate packages | 35 |
| **Total** | | | | **300** |

The 300 prospects represent a bottom-up research quota, not a verified TAM or an existing list of 300 real companies. Deduplicate across segments, check marketing fit and verify decision-maker access before outreach. Consumer products, mobility and F&B contributed ₹12.85L (64.25%) of the historical confirmed cash value; education is a secondary priority. Personal care had only one historical brand, so its high deal value is exploratory evidence.

A reported example of Kolkata festival sponsorship activity is [Xavrang 2024 at St. Xavier's University](https://www.telegraphindia.com/edugraph/campus/st-xaviers-university-kolkata-announces-the-4th-edition-of-xavrang24/cid/1995453). This contextual reference does not establish sponsorship prices, cash receipts or willingness to sponsor CampusFest. The company examples and package prices require independent commercial validation.

### Sponsor Fit Score (proposed)

Rate each criterion 1–5: audience relevance (25%), cash potential (25%), accessibility (20%), activation fit (15%) and decision/payment speed (15%). Score = sum of rating/5 × weight. Prioritize 80–100 immediately, 65–<80 for targeted qualification, 50–<65 for nurturing and <50 for low priority. Scores are team judgments, not validated predictive probabilities. Respect recorded opt-outs and use consent-based lead generation.

## 3. Historical evidence and data preparation

Source: RISA Labs `Sponsor Dataset.xlsx`, Challenge B. CampusFest 2025 ran 12–13 April 2025; source coverage is 15 January–20 April 2025, Asia/Kolkata. All source records are synthetic. The baseline uses end of **11 April 2025 IST**, immediately before the event.

Python preprocessing retained stable IDs, original column names and genuine repeat interactions/history versions. Six exact duplicate stable-ID records were removed. The unchanged workbook, cleaned CSVs, data dictionary and validation outputs are preserved in `SponsorOS_Data_Pack.zip`.

| Operational table | Raw rows | Clean rows |
|---|---:|---:|
| Brands | 180 | 180 |
| Contacts | 270 | 270 |
| Campaigns | 6 | 6 |
| Interactions | 953 | 950 |
| Qualification history | 434 | 433 |
| Opportunities | 58 | 58 |
| Opportunity history | 230 | 228 |
| Activations | 3 | 3 |
| Total | 2,134 | 2,128 |

Internal stable-ID and foreign-key checks passed in the prepared data pack. The external attendee-campaign references in activations were not validated. The 950 clean interaction records include 948 eligible before the festival.

### Verified historical baseline

| Metric | Value |
|---|---:|
| Brands / contacts | 180 / 270 |
| Outreach attempts / unique outbound brands | 321 / 141 |
| Reply events / unique responding brands across channels | 131 / 109 |
| Completed meetings / qualified brands | 60 / 60 |
| Qualified brand target | 55 |
| Opportunities / confirmed partnerships | 58 / 24 |
| Revised partnership target | 28 |
| Confirmed cash deals | 20 |
| Confirmed cash commitments | ₹20,00,000 |
| Confirmed in-kind value | ₹2,40,000 |
| Average confirmed cash deal | ₹1,00,000 |
| Advanced open cash pipeline | ₹10,50,000 |
| Actual cash received | Unknown (NULL) |

Qualification achievement = 60/55 = 109.09%; partnership achievement = 24/28 = 85.71%. The partnership target changed from 20 to 28 on 15 March 2025; the qualification target changed from 40 to 55.

| Historical campaign | Opportunities | Confirmed partnerships | Cash deals | Confirmed cash (₹L) | Advanced open cash (₹L) |
|---|---:|---:|---:|---:|---:|
| Brand Discovery Email | 11 | 0 | 0 | 0 | 3.60 |
| Warm Partner Introductions | 9 | 8 | 6 | 6.40 | 0 |
| Brand Leader LinkedIn | 12 | 0 | 0 | 0 | 4.00 |
| Partner Interest Form | 7 | 7 | 6 | 6.35 | 0 |
| Creator Network Referrals | 9 | 9 | 8 | 7.25 | 0 |
| Past Conversation Revival | 10 | 0 | 0 | 0 | 2.90 |
| **Total** | **58** | **24** | **20** | **20.00** | **10.50** |

Warm introductions and creator referrals account for (6.40 + 7.25)/20 = **68.25%** of historical confirmed cash value. Email consumed 223/321 = 69.47% of recorded outbound attempts with no confirmed deals by the cutoff. However, email, LinkedIn and revival together generated ₹10.5L in open advanced-stage cash opportunities. These observations justify improving targeting and closure, not asserting causal channel effectiveness or abandoning all outbound acquisition.

### Metric definitions and safeguards

- Use stable IDs rather than display names; count distinct brands separately from interaction events.
- Date filter: include eligible timestamps before the next local midnight in IST; use latest eligible full-state qualification, opportunity and target history. Do not leak later outcomes into earlier snapshots.
- Confirmed opportunity stage is `partner_confirmed`. Sum confirmed cash values separately from in-kind support. Open advanced cash value includes proposed cash amounts at `proposal_sent` or `negotiating`.
- Campaign attribution uses the originating sponsor campaign on the opportunity, not a causal incremental attribution model. Historical campaign acquisition costs are absent; historical CAC and ROI are unknown.
- 109 all-channel responding brands are not a matched cohort of the 141 outbound brands; only 70 overlap. Do not divide 109 by 141 and label it an outbound response rate. Funnel stage counts are descriptive unless matched cohorts are explicitly constructed.
- Historical receipts, overdue balances and payment delays are unknown, not zero. Preserve original records for evaluator testing.

## 4. Quantitative growth model

Planning constraints: 90-day window, eight team members, ₹1.5L acquisition budget, 300 prospecting targets, 43 proposed sponsorship slots. These are assumptions, not assignment-provided constraints or observed market capacities.

Cash collected = prospects × contact rate × conversation rate × proposal rate × cash-deal conversion × average signed cash deal × collection rate.

| Funnel | Conservative | Base | Stretch |
|---|---:|---:|---:|
| Prospects | 300 | 300 | 300 |
| Contacted | 240 | 240 | 270 |
| Conversations | 120 | 120 | 150 |
| Proposals | 60 | 60 | 75 |
| Cash deals | 20 | 30 | 36 |
| Average deal | ₹90,000 | ₹1,00,000 | ₹1,10,000 |
| Confirmed commitments | ₹18L | ₹30L | ₹39.6L |
| Collection rate | 70% | 80% | 90% |
| **Pre-festival cash forecast** | **₹12.6L** | **₹24L** | **₹35.64L** |

Base = 300 × 0.8 × 0.5 × 0.5 × 0.5 × ₹100,000 × 0.8 = ₹2,400,000. Stretch = 300 × 0.9 × (150/270) × 0.5 × 0.48 × ₹110,000 × 0.9 = ₹3,564,000. Conservative uses 20/60 proposal conversion. The ₹1L historical average deal anchors base pricing. Stretch assumes 10% higher average value and improved collections; these require validation. Confirmed commitment growth versus historical ₹20L is 50% base and 98% stretch; historical cash growth cannot be computed.

Base CAC = ₹150,000/30 = ₹5,000; stretch = ₹150,000/36 ≈ ₹4,167. Projected collected cash/acquisition spend = 16× and 23.76× respectively; neither is overall festival ROI or profit.

### Inventory and capacity

| Tier | List price | Slots | Base sales | Stretch sales |
|---|---:|---:|---:|---:|
| Title | ₹8L | 1 | 1 | 1 |
| Powered By | ₹4L | 2 | 1 | 2 |
| Gold | ₹2L | 4 | 3 | 4 |
| Silver | ₹1L | 8 | 5 | 8 |
| Associate | ₹0.5L | 12 | 8 | 12 |
| Community | ₹0.25L | 16 | 12 | 9 |
| **Total** | | **43** | **30** | **36** |

List-price ceiling ₹42L; base mix ₹30L; stretch mix ₹40.25L less ₹0.65L negotiated discounts = ₹39.6L. This validates arithmetic only, not sponsor demand, activation space or category exclusivity. A title sponsor at ₹8L is a material assumption and should be pursued early; downside scenarios must account for failure to sell that slot.

Team: one head, three research/outreach members, two partnership/sales members, one marketing/activation member, one finance member. Base workload over approximately 13 weeks: 300 researched brands, 240 contacted, 720 outreach attempts assuming three per brand, 120 conversations, 60 proposals and 30 closures. About 18–19 outreach attempts per outreach member per week. Shared staff must avoid overlapping commitments.

| Day | 15 | 30 | 45 | 60 | 75 | 90 |
|---|---:|---:|---:|---:|---:|---:|
| Cumulative cash deals | 2 | 6 | 12 | 20 | 27 | 30 |
| Cumulative cash collected (₹L) | 1 | 3 | 7 | 13 | 19 | 24 |

Suggested negotiated terms: 50% advance and remaining balance due seven days before festival; monitor deadlines and escalate delays. At 30 deals × ₹1L, raising collection from 70% to 90% adds ₹6L; five additional deals at 80% collection add ₹4L.

## 5. Five growth bets and prioritization

ICE = Impact × Confidence × Ease / 10, with each input rated 1–10. Scores are subjective judgments used to prioritize testing, not measured returns.

| Rank | Strategy | I/C/E | ICE | Budget | Timeline | Shared resources |
|---|---|---|---:|---:|---|---|
| 1 | CashFirst | 10/7/9 | 63.0 | ₹15K | Days 15–90 | Finance lead |
| 2 | SponsorConnect | 9/9/7 | 56.7 | ₹35K | Days 1–65 | 2 members |
| 3 | Deal Closure Accelerator | 9/8/7 | 50.4 | ₹25K | Days 20–83 | 2 incl. head |
| 4 | Sponsor Marketplace | 7/8/7 | 39.2 | ₹30K | Days 1–75 | 1 primary member |
| 5 | Precision Outreach | 7/5/5 | 17.5 | ₹25K | Days 1–70 | 2–3 shared |
| | Contingency | | | ₹20K | After review | Shared |

SponsorConnect uses alumni, creators and trusted introductions; Marketplace offers outcome-based sponsorship packages and a qualification form; Precision Outreach replaces generic email with tailored offers; Closure Accelerator tracks deal aging and escalates stalled proposals; CashFirst tracks advances, due dates, receipts and escalation. Double down on the first three ranked bets, test Marketplace before scaling, limit Precision investment, and reject indiscriminate bulk email.

### Non-overlapping acquisition contributions

| Channel | Reached | Conversations | Proposals | Signed cash deals | Average deal | Confirmed value | Attributed cash at 80% |
|---|---:|---:|---:|---:|---:|---:|---:|
| SponsorConnect | 90 | 45 | 22 | 12 | ₹1.25L | ₹15L | ₹12L |
| Marketplace | 50 | 25 | 15 | 8 | ₹1L | ₹8L | ₹6.4L |
| Precision | 100 | 50 | 23 | 10 | ₹0.7L | ₹7L | ₹5.6L |
| Total | 240 | 120 | 60 | 30 | ₹1L | ₹30L | ₹24L |

One primary acquisition source per sponsor. Closure and CashFirst are cross-funnel interventions, not additional acquisition channels. The modeled closure pilot recovers five incremental ₹1L deals (seven closures versus two without intervention among 16 at-risk proposals). The counterfactual waterfall is ₹25L × 65% = ₹16.25L, plus ₹5L × 65% = ₹3.25L from closure, plus ₹30L × (80% − 65%) = ₹4.5L from CashFirst, totaling ₹24L. These optimization contributions are already inside the attributed cash totals; never add them twice. The 65% reference collection rate and five-deal lift are assumptions, not historical measured effects.

## 6. Experiments and adaptive decisions

| Bet | Pilot / comparison | Primary KPI | Scale | Modify | Stop/change |
|---|---|---|---:|---:|---:|
| SponsorConnect | 25 introductions, 10 connectors, 14 days | Qualified meetings / introductions | ≥40% | 20–<40% | <20% |
| Marketplace | 100 relevant visitors per page variant, 21 days | Qualified inquiries / relevant visitors | ≥8% | 3–<8% | <3% |
| Closure | 16 at-risk proposals, 8 per group, 21 days | Signed deals / at-risk proposals | ≥40% | 20–<40% | <20% |
| Precision | 60 comparable brands, 30 per group, 21 days | Qualified meetings / contacted brands | ≥15% | 5–<15% | <5% |
| CashFirst | First 10 confirmed cash deals, 14-day minimum review; continue to event | Forecast pre-event collection rate | ≥80% | 65–<80% | <65% |

Marketplace tests visibility-led versus outcome-led messaging; Precision tests personalized versus standard messaging; Closure comparison receives normal follow-ups, not deliberate neglect. CashFirst is a process pilot, not a causal randomized experiment. Check denominator, minimum sample and elapsed duration before deciding. Thresholds are planning gates, not industry benchmarks; small samples yield directional evidence.

| Bet | Early signals / risk | Corrective action |
|---|---|---|
| SponsorConnect | Introductions, meeting rate; wrong decision-maker | Improve connector quality and commercial access |
| Marketplace | Qualified inquiry rate, cost/lead; poor intent | Improve targeting/form/value proposition; stop paid expansion if weak |
| Closure | Next-action coverage, stage duration; slow corporate approvals | Escalate high-value stalled deals; revise proposal |
| Precision | Response and qualified meetings; high effort | Refine contact selection; freeze generic outreach |
| CashFirst | Advance compliance, overdue amount; payment delays | Revise negotiated terms, reminders and escalation; never stop collection management |

Review weekly. Reserve ₹20K for evidence-backed scaling only; consider marginal expected cash, team capacity and time left. Illustrative reallocation: ₹12K to referrals and ₹8K to closure if pilots qualify; do not interpret as money actually spent. Seeded experiment observations (52%, 6%, 50%, 3.33%, 85%) are illustrative inputs, not derived from deal cohorts. Forecast and actual collection rates must remain separate.

## 7. Product and technical architecture

```text
Cloudflare Workers — deployed TanStack Start application (React / TypeScript / Vite / Nitro)
    ├── Supabase Auth — user session and login gate
    ├── PostgreSQL RPCs — deterministic dashboard calculations
    ├── RLS-protected editable tables — simulation workspace
    └── sponsor-copilot Edge Function
          ├── authenticated database reads and compact context selection
          ├── Gemini generation — answer + optional proposedTask
          └── UI confirmation → sponsoros_create_ai_task RPC → task list
```

The UI uses Tailwind CSS, Radix/Shadcn components, Recharts and TanStack Router. The initial Lovable prototype was exported, then extended and integrated manually in VS Code. Historical data lives in `sponsoros_source`; simulation tables in `public` are scoped by authenticated `user_id` with RLS. Historical records are read-only in the application. The publishable key is intentionally client-accessible; Gemini and service-role secrets are server-side only.

| Module | Capability | Verification status |
|---|---|---|
| Authentication | Email/password sign-in, session and logout UI | Local sign-in passed |
| Command Center | Live KPIs, funnel, targets, risks and campaign summaries | Default snapshots matched live SQL |
| Sponsors | Live records, search, filters, simulation editing | Integrated; writes not fully verified |
| Deal Pipeline | Live Kanban/table, stage and ownership management | Integrated; writes not fully verified |
| Revenue & Collections | Verified receipts, schedules, overdue, record payment | Integrated; full workflow unverified |
| Growth Analytics | Historical and simulation campaign performance | Integrated; full runtime checks deferred |
| Experiments | ICE scores, observations, decision gates | Integrated; write checks deferred |
| Growth Simulator | Scenario presets, what-if inputs and inventory warnings | Implemented; earlier model tests passed |
| Task Manager | Persistent tasks, priorities, owners and status | Integrated; persistence checks deferred |
| Data Explorer | Raw source / simulation records, filters and CSV export | Integrated; full runtime checks deferred |
| AI Copilot | Grounded answers and confirmed task proposals | Historical Q&A passed; simulation/action tests deferred |

### Database interface

| RPC | Purpose |
|---|---|
| `sponsoros_snapshot(p_date)` | Historical date-specific KPIs |
| `sponsoros_campaign_metrics(p_date)` | Historical campaign comparisons |
| `sponsoros_source_rows(...)` | Paginated raw source records (not date-filtered snapshots) |
| `sponsoros_simulation_metrics(p_date)` | Current workspace totals with dated receipt/activity filters |
| `sponsoros_create_ai_task(...)` | Authenticated task insert after UI confirmation |

Application tables: `sponsoros_brands`, `sponsoros_campaigns`, `sponsoros_deals`, `sponsoros_payment_schedules`, `sponsoros_payments`, `sponsoros_tasks`, `sponsoros_experiments`, `sponsoros_scenarios`. Foreign keys and RLS enforce ownership. Cross-user isolation has not been independently tested end to end.

## 8. Simulated operating workspace

Simulation date: 15 March 2027; assumed festival: 15 April 2027. Day 60 is a planning label. All simulated brand names, receipts, observations and dates are invented for the demo.

| Metric | Verified seed / expected output |
|---|---:|
| Prospects / contacted / conversations | 300 / 190 / 95 |
| Opportunities / confirmed cash deals | 42 / 20 |
| Confirmed cash commitments | ₹21L |
| Simulated verified receipts | ₹13.5L |
| Outstanding / overdue | ₹7.5L / ₹2.8L |
| Collection rate | 64.29% |
| Base target / achievement | ₹24L / 56.25% |
| Remaining cash to base | ₹10.5L |
| Budget / spent / remaining | ₹1.5L / ₹92K / ₹58K |

The seed includes 40 schedules, 17 receipts, five experiments, three scenarios, five tasks and six campaign/budget rows including contingency. Ten fully paid deals contribute ₹10L, seven partially paid deals contribute ₹3.5L of ₹7.7L, and three unpaid deals have ₹3.3L committed. The outstanding and overdue metrics derive from individual records.

SQL sums eligible verified receipts on current confirmed cash deals, with cutoff before next midnight IST. Outstanding is sum of max(commitment − received, 0) by deal. Overdue is sum of max(min(cumulative scheduled amount with due date before selected date, commitment) − received, 0) by deal, assuming oldest-first allocation. Due-today amounts are not overdue. Budget remaining = allocation − spend. Collection rate divides receipts by confirmed value; zero denominator yields null. The simulation is not a full historical state reconstruction; deal and budget states are current. Base/stretch target constants in the RPC are fixed; the what-if simulator remains a distinct planning tool.

Even perfect collection of current commitments gives ₹21L, leaving at least ₹3L in additional collected cash to hit base. Recover overdue amounts first while closing additional deals. The simulated campaign is deliberately unfinished to support actionable analysis.

## 9. AI Copilot design and integration

The model is not fine-tuned. It uses authenticated database context and deterministic SQL totals at request time. Historical requests include snapshot and campaign summaries; simulation requests select relevant workspace detail. Recent conversation history is limited to four messages. The primary observed model is `gemini-3.5-flash-lite`; the prepared backend supports an optional `GEMINI_FALLBACK_MODEL`. A fallback may consume another request. Model availability and quotas are provider-dependent.

```json
{"question":"What is preventing us from achieving our target?","mode":"historical","asOf":"2025-04-11","history":[]}
```

The response includes `answer`, `proposedTask` (object or null), `mode`, `asOf`, `model` and `dataGrounded`. The latter indicates database context was used, not a guarantee of factual accuracy. The browser sends an authenticated request to `sponsor-copilot`, validates the response and displays the answer. In simulation mode only, an explicitly requested task proposal may be presented for confirmation. Confirming calls `sponsoros_create_ai_task` with title, description, owner, due date and priority; optional deal/campaign links are deliberately null in the current AI UI. No additional Gemini request is required to save a proposed task. The model cannot directly update deals or payments.

The included `backend/functions/sponsor-copilot/index.ts` is the latest available prepared correction, with bounded context, JSON output and incomplete-response rejection. It has not been byte-compared against the currently deployed function. Historical browser tests returned accurate default figures, but the simulation response was previously truncated; the corrected simulation/task workflow was not retested. A historical answer also compared historical commitments with the future simulation target supplied in a question; these targets must remain distinct. Review AI output against the deterministic dashboard before acting.

## 10. Setup and reproducibility

### Local frontend

Clone the repository or download its ZIP. Open the directory containing `package.json`. Node.js and npm are required; the successful local development session used Node v26.13.1 and npm 11.20.0. Use a compatible Node release and the checked-in lockfile.

Create `.env.local` from `.env.example` and enter the URL and publishable (or legacy anon) key of the intended Supabase project. Never place a service-role key, database password or Gemini key in a `VITE_` variable. Keep `.env.local` ignored by Git.

```bash
npm ci
npm run dev
npm run test
npx tsc --noEmit
npm run build
```

On Windows PowerShell, use `npm.cmd` / `npx.cmd` if script execution is blocked. The development server prints the actual localhost URL (8080 was the initial port). Tests were run before the integration patches; rerun on the final code for an updated result. The production build was completed after final UI polishing.

### Recreate the backend (fresh project only)

Do **not** rerun setup or seed scripts on the existing deployed database. The historical SQL embeds cleaned source records; importing the CSVs again is unnecessary. The following files are supplied in the accompanying documentation/backend package:

| Order | File | Purpose |
|---|---|---|
| 1 | `backend/sql/01_setup.sql` | Historical data, RPCs, simulation schema and RLS |
| 2 | `backend/sql/02_verify.sql` | Historical checks |
| 3 | `backend/sql/03_simulation_setup.sql` | Synthetic simulation seed |
| 4 | `backend/sql/04_revenue_functions.sql` | Simulation analytics |
| 5 | `backend/sql/05_simulation_verify.sql` | Seed assertions |
| 6 | `backend/sql/06_create_ai_task.sql` | Reconstructed task RPC for reproducibility |

Run 01 and 02 in Supabase SQL Editor. Create exactly one confirmed project-only demo user in Authentication → Users, then run 03–06 individually. The seed refuses ambiguous or nonempty workspaces. Keep the seeded user; deleting the account can cascade-delete owned simulation records. The reconstructed 06 migration matches the client RPC contract and existing table/RLS schema but is not the retrieved original deployed SQL, and has not been executed. Verify it in a fresh test project before use.

Create the Edge Function `sponsor-copilot` from `backend/functions/sponsor-copilot/index.ts`. Configure the Gemini key as `Gemini_API_key` (or `GEMINI_API_KEY`); the included source accepts either. Optional fallback: `GEMINI_FALLBACK_MODEL`. If legacy JWT gateway verification is disabled, the function must continue validating the caller's bearer token with Supabase Auth. Never enable anonymous AI requests. Restrict any shared demo to synthetic data and monitor quota.

### Cloudflare deployment

The verified deployment used the locally generated Nitro/Cloudflare build, not an automatic GitHub deployment. After creating `.env.local` and completing the build:

```bash
npx wrangler login
npx wrangler deploy --config .output/server/wrangler.json --name sponsoros
```

The generated config points to `index.mjs` with a static-assets binding and `nodejs_compat`. Register a `workers.dev` subdomain when prompted. The existing application is deployed at https://sponsoros.sponsoros-app.workers.dev. Rebuilding with a different Supabase URL/key changes the backend used by the new bundle. Git pushes alone do not redeploy this manually hosted build. Never commit `.output`, `.wrangler`, `node_modules`, environment secrets or demo passwords.

### Submission materials

- Live application and repository links above.
- Three-slide growth strategy deck (`SponsorOS_Slides_1-3.pptx`); final PDF export and visual review are separate submission steps.
- `SponsorOS_Data_Pack.zip` contains cleaned historical data, the original workbook and validation artifacts; retained separately. Do not redistribute assignment datasets outside authorized evaluation.
- Backend SQL, available Edge Function source and this README are supplied in a merge-ready documentation package. The candidate must still copy and commit these into the repository; their presence in the remote repository is not yet verified.

## 11. Testing and verification record

| Check | Observed result |
|---|---|
| Historical SQL import and default snapshot, campaign values and target revision | Passed in Supabase |
| Simulation seed and SQL financial assertions | Passed in Supabase |
| Frontend checkpoint tests | 15/15 passed before live integration |
| TypeScript checkpoint | Passed; later strict-type issues corrected |
| Local Supabase sign-in | Passed |
| Live Command Center historical and simulation defaults | User confirmed expected values matched |
| Historical AI Q&A in browser | Passed; correct default historical metrics and missing receipts |
| Simulation AI and confirmed task persistence | Deferred; earlier truncated response, no verified end-to-end success |
| CRM, deal, receipt, experiment and task writes / cross-user isolation | Implemented; not fully runtime-tested |
| Final production build | Passed on user's laptop |
| Git push | Successful to new SponsorOS repository |
| Cloudflare deploy and DNS | Successful; HTTP HEAD returned 200 |
| Public browser access | User confirmed website opens and works |
| Dedicated evaluator access and final deck PDF | Pending confirmation |

## 12. Known limitations and next steps

- Synthetic historical and simulation data do not establish real sponsorship demand or cash receipts. Market sizes, package prices, ICE scores and pilots are planning assumptions.
- Historical cash receipts and campaign costs are unavailable; historical ROI and collection rate cannot be inferred. Funnel counts are not necessarily matched cohorts.
- Simulation dates filter receipts, due dates and brand milestones, not complete historical deal or budget states. Payment allocation assumes oldest-first; payment reconciliation, audit logging and concurrency-safe financial validation need further development.
- AI retrieval is bounded and keyword-driven. Provider errors and incomplete responses occurred during development. The corrected simulation/action flow needs verification; the model may misinterpret cross-mode targets. Avoid reliance on AI for authoritative financial calculations.
- UI financial writes use application-level validation; production multi-user/concurrent operations require additional transactional constraints. Shared demo credentials expose the same editable workspace to all holders. Use private access and reset/reseed only in an isolated demo environment if appropriate.
- Sponsor Fit Score, sponsor package inventory and public marketplace are strategy/planning concepts rather than fully operational marketplace or inventory management modules.
- Free-tier service limits and provider availability may affect the demo. Keep the database active and verify evaluator access before submission.

## 13. Tools, reuse and sources

| Tool / source | Role |
|---|---|
| RISA Labs Growth APM Assignment.pdf | Original case brief |
| Sponsor Dataset.xlsx | Original synthetic Challenge B data |
| Python / Pandas | Data cleaning, validation and reference calculations |
| Supabase | PostgreSQL, Auth, RLS, SQL RPCs and Edge Functions |
| Lovable | Initial frontend prototype; free-credit-limited development |
| ChatGPT | Assisted strategy, calculations, SQL, TypeScript, debugging, presentation and documentation |
| Google AI Studio / Gemini API | Model configuration and generation |
| VS Code / Git / GitHub | Manual integration, local builds and version control |
| Cloudflare Workers / Wrangler | Public hosting and deployment |
| PowerPoint | Three-slide strategy presentation |

The user executed database setup and verification, configured secrets, installed dependencies, applied patches, tested the application and deployed it. AI-generated implementation was adapted to the existing schema and data-origin safeguards. No proprietary model training or actual sponsorship validation is claimed.
