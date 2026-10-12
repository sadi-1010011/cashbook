export const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kaayi2.vercel.app';

export const landingFaqs = [
    {
        q: "Where is my financial data stored?",
        a: "100% on your device inside your browser's sandboxed IndexedDB database. Cashbook operates without remote servers, user databases, or cloud accounts. Your money records never leave your physical device."
    },
    {
        q: "How do I download and install Cashbook without an App Store?",
        a: "Cashbook is a Progressive Web App (PWA). On mobile, tap the 'Install App' button or tap 'Share > Add to Home Screen' in Safari/Chrome. On desktop, click the Install icon in your browser URL bar. It installs instantly with zero storage bloat."
    },
    {
        q: "Does Cashbook connect to my bank account or credit cards?",
        a: "No. Cashbook is strictly zero-telemetry and decentralized. By avoiding third-party banking aggregators, your financial credentials and transaction logs remain completely immune to cloud leaks, data scraping, and cyberattacks."
    },
    {
        q: "How do I transfer or back up my data to a new phone?",
        a: "In Settings, tap 'Export Data' to generate an encrypted JSON backup file. When you switch devices, open Cashbook on your new phone and tap 'Import Data' to restore your complete transaction and budget ledger in seconds."
    },
    {
        q: "Is Cashbook really free?",
        a: "Yes. Cashbook is 100% free and open-source. There are no monthly paywalls, premium feature tiers, or hidden subscriptions."
    }
];

export const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CashBook",
    "alternateName": "Kaayi CashBook",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "All (Web, iOS, Android, macOS, Windows, Linux)",
    "browserRequirements": "Requires HTML5 IndexedDB and Service Worker support",
    "url": BASE_URL,
    "description": "CashBook is a private, offline-first personal finance and expense tracking Progressive Web App (PWA). Record income, expenses, debts, recurring bills, and subscriptions with zero cloud tracking and zero accounts.",
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "category": "Free"
    },
    "featureList": [
        "100% Offline-First Architecture via Localbase IndexedDB",
        "Zero Cloud Telemetry and No Account Setup Required",
        "Multi-Currency Engine Supporting 8 Global Currencies (USD, EUR, GBP, INR, AED, SAR, JPY, AUD)",
        "Recurring Bills Tracker with Due Date Countdowns and Zero Late Fees",
        "Subscription Radar for Annualized Commitment Projections",
        "One-Click JSON Data Export and Instant Device Restore",
        "Visual Expense Analytics and Category Donut Charts"
    ],
    "screenshot": `${BASE_URL}/og-image.png`,
    "author": {
        "@type": "Organization",
        "name": "CashBook",
        "url": BASE_URL
    }
};

export const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": landingFaqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
        }
    }))
};

export const webSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "CashBook",
    "url": BASE_URL,
    "description": "100% Offline Personal Finance & Expense Tracker PWA",
    "publisher": {
        "@type": "Organization",
        "name": "CashBook",
        "url": BASE_URL,
        "logo": {
            "@type": "ImageObject",
            "url": `${BASE_URL}/icons/icon-chrome-512x512.png`
        }
    }
};
