# CashBook - Personal Finance Management App

Live UI can be visited at: [https://kaayi2.vercel.app/](https://kaayi2.vercel.app/)

CashBook is a modern, offline-first personal finance management Progressive Web App (PWA) designed to track income, expenses, debts, bills, and subscriptions. Built with Next.js 16 and React 19, CashBook provides instant, private, client-side financial tracking directly within the browser without requiring a centralized backend server.

---

## 🏗 Architecture & Tech Stack

- **Framework:** [Next.js (App Router)](https://nextjs.org/) `16.3.8` (Webpack runner for PWA service-worker compatibility).
- **Core Library:** [React 19](https://react.dev/) `19.3.0` & React DOM `19.3.0`.
- **Language:** TypeScript 5 with strict primitive types and complete interfaces across models.
- **State Management:** [Zustand 5](https://github.com/pmndrs/zustand) for reactive, modular client stores (`transactionStore`, `billStore`, `subscriptionStore`, `budgetStore`, `currencyStore`).
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with full dark mode support (`next-themes`) and curated design tokens.
- **Client-Side Storage:** [Localbase](https://github.com/dannyconnell/localbase) (IndexedDB wrapper). Data is isolated in the `kaayidb` database with collections for `alltransactions`, `bills`, `subscriptions`, and settings.
- **Offline & PWA:** `next-pwa` registers service workers (`/sw.js`) and precaches static assets for a 100% offline-first experience.
- **Data Visualization & Animations:** Custom Chart.js integration, HTML5 Canvas rendering, and `react-countup` smooth balance counters.
- **Icons & Design System:** Tailored SVG vector iconography system located in `components/icons`.
- **Notifications & Safeguards:** `react-hot-toast` for non-blocking feedback, action confirmations, and deletion safeguards.

---

## ✨ Core Features & Routes

### 1. Dashboard (`/dashboard`)
The central financial command center:
- **Total Balance & Overview:** Displays net balance, dynamic income, expense, and debt breakdowns.
- **Recent Activity:** Quick ledger of the last **6** transactions with instant click-to-edit.
- **Budget Tracking:** Real-time progress bar reflecting monthly expenditure against custom budget goals.
- **Quick Actions:** Instant shortcuts to log new transactions, view analytics, manage bills, and tune subscriptions.

### 2. Transaction Management (`/newtransaction`)
Record or edit income, expenses, and debts:
- **Types:** Income, Expense, Debt.
- **Amount & Currency:** Configurable currency symbol with real-time numeric validation.
- **Categories:** Food, Travel, Movies, Haircut, Medicine, Salary, Tip, Loans, and Others.
- **Editing Mode:** Supports query-param-based editing (`?editId=...`) with prefilled metadata and timestamp preservation.

### 3. Transaction History (`/history`)
Comprehensive financial ledger:
- Reverse-chronological feed of all recorded transactions.
- Filter by transaction type (Income, Expense, Debt) and search by note/category.
- Edit and delete actions with confirmation safeguard toasts.

### 4. Focused Income & Expense Views (`/income`, `/expense`)
- Specialized views with timeframe filters (Daily, Weekly, Monthly).
- Dynamic count badges and responsive transaction feeds.

### 5. Statistics & Analytics (`/stats`)
- High-level breakdown of spending and earnings by category.
- Interactive Chart.js charts and HTML5 canvas visualizations.
- Filter analytics across custom date ranges and timeframes.

### 6. Bill Tracker (`/bills`)
- Track upcoming utility, credit, and recurring obligations.
- Mark bills as paid/unpaid with real-time status badges.
- Presets for rapid bill entry and deletion confirmation modals.

### 7. Subscription Manager (`/subscriptions`)
- Monitor active subscriptions, recurring commitments, and renewal dates.
- Billing frequency management (Monthly / Yearly).
- Calculates monthly committed burn rate.

### 8. Settings & Data Safety (`/settings`)
- **Budget Limits:** Configure monthly spending thresholds.
- **Currency Selection:** Switch between global currency symbols ($, €, £, ₹, ¥, etc.).
- **Complete JSON Backup & Restore:** Export versioned backup files containing all collections (`transactions`, `bills`, `subscriptions`, `budget`, `currency`) and safely restore them anytime.
- **Wipe Data Safeguard:** Nuclear wipe with modal confirmation to clean-slate all IndexedDB collections.

---

## 📂 Project Organization

```text
cashbook/
├── app/                  # Next.js App Router pages, layouts, error & loading states
│   ├── dashboard/        # Dashboard overview
│   ├── history/          # All transaction ledger
│   ├── income/           # Filtered income view
│   ├── expense/          # Filtered expense view
│   ├── bills/            # Bill tracker
│   ├── subscriptions/    # Subscription manager
│   ├── newtransaction/   # Create / Edit transactions
│   ├── stats/            # Analytics & visual charts
│   ├── settings/         # Budget, currency & backup/restore
│   ├── error.tsx         # Global offline-first error boundary
│   └── not-found.tsx     # 404 handler
├── components/           # Reusable UI component library
│   ├── icons/            # Centralized SVG vector icons
│   ├── loading/          # Shimmering card skeleton loader
│   ├── transcard/        # Transaction card with deletion safeguard
│   ├── billCard/         # Bill item card
│   ├── subscriptionCard/ # Subscription item card
│   ├── header/ & footer/ # Application navigation bars
│   └── modals/           # Add/confirm/wipe/filter dialogs
├── store/                # Zustand client stores
│   ├── transactionStore.ts
│   ├── billStore.ts
│   ├── subscriptionStore.ts
│   ├── budgetStore.ts
│   └── currencyStore.ts
├── services/             # Storage abstraction layer
│   └── db.ts             # Localbase IndexedDB concurrent operations
├── hooks/                # Custom React hooks (useFilteredTransactions)
├── constants/            # Application presets, categories, currencies
├── types/                # TypeScript models and interfaces
├── utils/                # Financial calculations, dates, and chart drawing
└── public/               # Manifest, PWA service worker, static assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18+ or Node.js 20+
- npm, pnpm, yarn, or bun

### Installation

1. Install project dependencies:
```bash
npm install
```

2. Start the local development server (Webpack runner enabled):
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm run start
```
