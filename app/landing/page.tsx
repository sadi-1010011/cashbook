import type { Metadata } from "next";
import LandingClient from "./LandingClient";
import { softwareAppSchema, faqPageSchema, webSiteSchema, BASE_URL } from "./seo";

export const metadata: Metadata = {
    title: {
        absolute: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
    },
    description: "Track income, expenses, debts, recurring bills, and subscriptions 100% offline. Free, private, multi-currency personal finance PWA with zero cloud tracking, zero accounts, and local IndexedDB storage.",
    keywords: [
        "CashBook",
        "offline expense tracker",
        "personal finance pwa",
        "offline budget app",
        "private money manager",
        "offline cash book",
        "IndexedDB finance app",
        "zero telemetry budget",
        "bill tracker offline",
        "subscription tracker pwa",
        "multi-currency expense tracker",
        "free expense ledger",
        "local first personal finance",
        "open source expense tracker",
        "progressive web app finance"
    ],
    authors: [{ name: "CashBook Team", url: BASE_URL }],
    creator: "CashBook",
    publisher: "CashBook",
    applicationName: "CashBook",
    category: "finance",
    classification: "Personal Finance & Budgeting",
    alternates: {
        canonical: `${BASE_URL}/landing`,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        title: "CashBook — Master Your Money Privately (100% Offline PWA)",
        description: "Private, offline-first personal finance tracker. Zero accounts, zero cloud servers, zero subscription paywalls. Track daily expenses, bills, and 8 currencies on your device.",
        url: `${BASE_URL}/landing`,
        siteName: "CashBook",
        locale: "en_US",
        type: "website",
        images: [
            {
                url: `${BASE_URL}/og-image.png`,
                width: 1376,
                height: 768,
                alt: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
        description: "Private, offline-first personal finance tracker. Zero accounts, zero cloud servers, zero subscription paywalls. 100% offline.",
        images: [`${BASE_URL}/og-image.png`],
        creator: "@cashbook",
    },
};

export default function LandingPage() {
    return (
        <>
            {/* Structured Data: WebApplication Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            {/* Structured Data: FAQPage Schema for Google Rich Snippets */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
            />
            {/* Structured Data: WebSite Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
            />
            <LandingClient />
        </>
    );
}
