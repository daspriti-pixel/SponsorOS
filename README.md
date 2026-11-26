# Sponsor Growth Command Center

Build a premium, professional, responsive SaaS web application named **SponsorOS**, with the tagline **"From Prospect to Payment."**

SponsorOS is an AI-powered sponsorship growth command center designed for college festival organizers, sponsorship heads and partnership management teams. Its primary objective is to maximize actual sponsorship cash collected before a festival, rather than merely increasing sponsorship commitments.

## 1. Technology and architecture

- Use React, TypeScript, Tailwind CSS, shadcn/ui, Lucide Icons and Recharts.
- Build reusable, modular and maintainable components.
- Use centralized TypeScript interfaces and a shared data service layer.
- Keep business logic, data access and presentation components separate.
- Use realistic mock data initially, but structure the application so mock data can easily be replaced with Supabase database queries.
- Use localStorage for temporary persistence of campaign edits, sponsorship opportunities and tasks until the database is connected.
- Do not require authentication for the initial prototype.
- Do not integrate an external AI API or Supabase yet.
- Do not hardcode calculated dashboard totals directly into UI components.
- Avoid unnecessary dependencies and overly complicated implementation.

## 2. Design system

Create a sophisticated enterprise SaaS dashboard inspired by modern CRM and revenue intelligence platforms.

Use the following design specifications:

- Primary accent: Indigo #4F46E5
- Sidebar: Dark navy #0F172A
- Main background: #F8FAFC
- Cards: White
- Primary text: #0F172A
- Secondary text: #64748B
- Success: #10B981
- Warning: #F59E0B
- Critical: #EF4444
- Font: Inter
- Compact, consistent spacing
- Subtle shadows and borders
- Professional rounded cards
- High-quality charts and tables
- Consistent typography hierarchy

Avoid excessive gradients, glassmorphism, oversized headings, decorative illustrations and unnecessary animations.

The product should look like a commercially viable revenue management platform, not a student project or a generic marketing website.

## 3. Application layout

Create a collapsible left sidebar containing:

OVERVIEW
- Command Center

GROWTH
- Sponsors
- Deal Pipeline
- Growth Analytics

REVENUE
- Revenue & Collections

EXECUTION
- Task Manager

SYSTEM
- Data Explorer

Include a persistent AI Copilot button accessible from every page.

The top header should contain:

- Current page title
- Festival selector: CampusFest
- Data mode selector: Historical / Growth Simulation
- As-of-date selector
- Global search
- AI Copilot button
- User profile icon

Ensure all sidebar navigation links work.

## 4. Command Center dashboard

Create an executive dashboard with the heading:

"Growth Command Center"

Subtitle:

"Monitor sponsorship performance, identify revenue opportunities and turn insights into action."

Display a visible data-mode badge distinguishing historical data from simulated planning data.

Create KPI cards for:

- Cash Collected
- Confirmed Cash Sponsorship
- Qualified Sponsors
- Confirmed Partnerships
- Advanced-Stage Pipeline Value
- Target Achievement

Use the following preliminary historical reference figures:

- Total potential brands: 180
- Qualified brands: 60
- Opportunities: 58
- Confirmed partnerships: 24
- Confirmed cash deals: 20
- Confirmed cash sponsorship value: ₹20,00,000
- Confirmed in-kind value: ₹2,40,000
- Proposed advanced-stage sponsorship pipeline: ₹10,50,000
- Revised partnership target: 28

These figures are preliminary historical reference data, not verified imported source records.

IMPORTANT: Actual historical cash collection is unavailable. Display "Not Available" with an explanatory tooltip. Never represent confirmed sponsorship value as collected cash.

Include the following visualizations:

1. Sponsorship Funnel:
   - Potential Brands
   - Brands Contacted
   - Conversations
   - Qualified Brands
   - Opportunities
   - Confirmed Partnerships

2. Campaign Performance:
   Horizontal bar chart comparing confirmed cash sponsorship value by campaign.

3. Pipeline Distribution:
   Donut chart showing opportunities by stage.

4. Target vs Actual:
   Compare qualified brands and confirmed partnerships against their targets.

5. Revenue Overview:
   Distinguish confirmed cash sponsorship, in-kind sponsorship, collected payments and outstanding commitments.

6. Priority Alerts:
   Display stalled opportunities, urgent follow-ups, missing payment data and upcoming tasks.

7. Growth Insights:
   Create a section for actionable, data-derived recommendations.

Do not display unsupported metrics as zero. Use "Not Available" where data is missing.

## 5. Sponsors page

Create a professional sponsor CRM with:

- Searchable sponsor table
- Industry filter
- Qualification filter
- Owner filter
- Fit score filter
- Add Sponsor button
- Edit Sponsor functionality
- Sponsor detail drawer

Each sponsor record should support:

- Brand name
- Industry
- Contact information
- Qualification status
- Assigned owner
- Sponsor Fit Score
- Estimated sponsorship potential
- Next action
- Last interaction date

Use clearly labelled simulated records for initial UI demonstration. Do not invent historical brand records.

Sponsor Fit Score should support five weighted criteria:

- Audience relevance: 25%
- Cash potential: 25%
- Accessibility: 20%
- Activation fit: 15%
- Decision and payment speed: 15%

Use centralized functions to calculate the score.

## 6. Deal Pipeline page

Create a functional Kanban-style sponsorship pipeline with the following stages:

- Prospecting
- Contacted
- Proposal Sent
- Negotiating
- Confirmed
- Lost
- Withdrawn

Each deal card should display:

- Brand name
- Proposed sponsorship value
- Cash or in-kind support type
- Assigned owner
- Days in current stage
- Expected closure date
- Risk indicator
- Next action

Allow users to create opportunities, edit opportunities and change stages.

Update relevant dashboard calculations whenever opportunities change.

Include a table view as an alternative to the Kanban view.

## 7. Growth Analytics page

Create two tabs:

Tab 1: Campaign Performance

Compare the following preliminary historical campaign summaries:

- Brand Discovery Email: 11 opportunities, 0 confirmed partnerships, ₹0 confirmed cash value.
- Warm Partner Introductions: 9 opportunities, 8 confirmed partnerships, ₹6.4 lakh confirmed cash value.
- Brand Leader LinkedIn: 12 opportunities, 0 confirmed partnerships, ₹0 confirmed cash value.
- Partner Interest Form: 7 opportunities, 7 confirmed partnerships, ₹6.35 lakh confirmed cash value.
- Creator Network Referrals: 9 opportunities, 9 confirmed partnerships, ₹7.25 lakh confirmed cash value.
- Past Conversation Revival: 10 opportunities, 0 confirmed partnerships, ₹0 confirmed cash value.

Clearly identify these as preliminary historical summaries awaiting full dataset import.

Include campaign comparison charts, conversion rates, filters, performance indicators and campaign management controls.

Do not calculate historical acquisition cost or ROI without expenditure data.

Tab 2: Growth Experiments

Create experiment cards for:

1. SponsorConnect
2. Sponsor Marketplace
3. Deal Closure Accelerator
4. Precision Outreach
5. CashFirst

Each experiment should display:

- Hypothesis
- Primary KPI
- Target
- Actual performance
- Sample size
- Budget
- Owner
- Experiment status
- Scale / Modify / Stop / Insufficient Data recommendation

Create an editable experiment configuration.

Use the following preliminary KPI thresholds:

- SponsorConnect: Scale at qualified meeting rate ≥40%; modify at 20% to below 40%; stop expansion below 20%.
- Sponsor Marketplace: Scale at qualified inquiry conversion ≥8%; modify at 3% to below 8%; stop paid expansion below 3%.
- Deal Closure Accelerator: Scale at at-risk proposal closure ≥40%; modify at 20% to below 40%; stop experimental playbook below 20%.
- Precision Outreach: Scale at qualified meeting rate ≥15%; modify at 5% to below 15%; stop expansion below 5%.
- CashFirst: Scale at forecast collection rate ≥80%; modify at 65% to below 80%; change payment approach below 65%.

Do not recommend practical scaling or stopping if the minimum sample size or experiment duration has not been met.

## 8. Revenue & Collections page

Create two tabs:

Tab 1: Payment Tracker

Include:

- Confirmed cash commitments
- Cash collected
- Outstanding amount
- Overdue amount
- Collection rate
- Payment forecast

Create a payment management table with:

- Sponsor
- Confirmed amount
- Received amount
- Outstanding amount
- Payment due date
- Payment status

Allow simulated payment transactions to be added and edited.

Clearly distinguish simulated payment data from the historical dataset.

Historical cash collection must remain unavailable unless actual payment records are imported.

Tab 2: Growth Simulator

Create a fully interactive scenario simulator with editable inputs:

- Potential sponsor brands: 300
- Prospect-to-contact conversion: 80%
- Contact-to-conversation conversion: 50%
- Conversation-to-proposal conversion: 50%
- Proposal-to-signed-cash-deal conversion: 50%
- Average cash deal size: ₹1,00,000
- Pre-festival collection rate: 80%
- Acquisition budget: ₹1,50,000

Calculate:

- Expected contacted brands
- Expected conversations
- Expected proposals
- Expected signed cash deals
- Confirmed cash sponsorship value
- Projected pre-festival cash collection
- Cost per acquired cash sponsor
- Cash collected per rupee spent

Add three scenario presets:

Conservative:
- 20 cash deals
- ₹90,000 average deal size
- 70% collection rate
- ₹12.6 lakh projected collection

Base:
- 30 cash deals
- ₹1,00,000 average deal size
- 80% collection rate
- ₹24 lakh projected collection

Stretch:
- 36 cash deals
- ₹1,10,000 average deal size
- 90% collection rate
- ₹35.64 lakh projected collection

Calculate values dynamically when users edit inputs.

Flag scenarios exceeding the proposed maximum contracted sponsorship inventory of ₹42 lakh or 43 sponsorship slots.

## 9. Task Manager

Create functional Kanban and list views.

Task statuses:

- To Do
- In Progress
- Completed

Support:

- Create task
- Edit task
- Delete task
- Assign owner
- Set due date
- Set priority
- Link sponsor
- Link opportunity
- Link campaign

Ensure changes persist using the temporary data service.

Include overdue task indicators and dashboard task summaries.

## 10. AI Copilot

Create a polished expandable right-side AI Copilot panel.

Include:

- Conversation history layout
- Message input
- Suggested questions
- Supporting data section
- Recommendation cards
- Proposed action confirmation interface

Suggested questions:

- Which sponsorship campaign performs best?
- What is preventing us from achieving our target?
- Which deals require immediate follow-up?
- How can we improve cash collection?
- What happens if our collection rate increases?

Do not implement fake AI-generated answers.

Do not hardcode chatbot responses.

For now, clearly indicate that AI integration is pending. Build the interface and service architecture so a real backend AI endpoint can be connected in a later development phase.

## 11. Data Explorer

Create a data transparency page with:

- Data source information
- Historical, simulated and manually entered data labels
- Table navigation
- Searchable data tables
- Metric definitions
- Data quality information
- CSV export where practical

Explain that the original sponsorship workbook will be imported during the next development phase.

Do not invent original workbook records.

## 12. Functional requirements

- All navigation must work.
- Forms should validate required fields.
- All major controls should perform their stated functions or be explicitly marked as pending integration.
- Include loading, empty and error states.
- Use consistent Indian currency formatting.
- Separate cash sponsorship from in-kind support.
- Keep historical facts separate from simulated forecasts.
- Avoid misleading calculations when data is incomplete.
- Use reusable components and centralized calculation utilities.
- Ensure dashboards respond to changes in editable simulated records.
- Make the application responsive and professional.

Prioritize correctness, usability and maintainability over decorative features.

Create the application foundation and all page layouts in one cohesive implementation. Do not spend effort on unnecessary landing pages, complex authentication, external integrations or advanced animations.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1ed4248c-9292-4e9c-97da-14bdeab15063).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
