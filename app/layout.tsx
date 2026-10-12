import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer/footer";
import PwaStatus from "@/components/pwa/PwaStatus";

import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://kaayi2.vercel.app'),
  title: {
    default: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
    template: "%s | CashBook",
  },
  description: "Personal finance management offline PWA. Record expenses, automate recurring bills, monitor subscriptions, and track 8 global currencies 100% offline with zero cloud tracking.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CashBook",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/icon-96x96.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
    description: "Personal finance management offline PWA. 100% private with zero cloud tracking and zero subscription paywalls.",
    siteName: "CashBook",
    images: [
      {
        url: "/og-image.png",
        width: 1376,
        height: 768,
        alt: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CashBook — 100% Offline Personal Finance & Expense Tracker PWA",
    description: "Personal finance management offline PWA. 100% private with zero cloud tracking.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <PwaStatus />
          {children}
          <Toaster 
            position="top-center" 
            toastOptions={{
              className: '!bg-white dark:!bg-slate-900 !text-gray-900 dark:!text-white border border-gray-100 dark:border-slate-800 shadow-lg rounded-2xl',
            }}
          />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
