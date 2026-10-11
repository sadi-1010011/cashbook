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
  title: "CashBook",
  description: "Personal finance management offline PWA",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CashBook",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-96x96.png",
    apple: "/icons/apple-touch-icon.png",
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
