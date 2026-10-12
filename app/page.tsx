import type { Metadata } from "next";
import LandingClient from "./landing/LandingClient";
import { softwareAppSchema, faqPageSchema, webSiteSchema, BASE_URL } from "./landing/seo";

export const metadata: Metadata = {
    title: {
        absolute: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
    },
    description: "Track income, expenses, debts, recurring bills, and subscriptions 100% offline. Free, private, multi-currency personal finance PWA with zero cloud tracking, zero accounts, and local IndexedDB storage.",
    alternates: {
        canonical: BASE_URL,
    },
    openGraph: {
        title: "CashBook — Master Your Money Privately (100% Offline PWA)",
        description: "Private, offline-first personal finance tracker. Zero accounts, zero cloud servers, zero subscription paywalls. Track daily expenses, bills, and 8 currencies on your device.",
        url: BASE_URL,
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

export default function Home() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
            />
            <LandingClient />
        </>
    );
}