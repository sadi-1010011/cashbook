"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { WifiOffIcon, RefreshCwIcon } from "@/components/icons";

export default function PwaStatus() {
    const [isOffline, setIsOffline] = useState(false);
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        // Initial online/offline check
        if (typeof window !== "undefined") {
            setIsOffline(!navigator.onLine);
        }

        const handleOnline = () => {
            setIsOffline(false);
            toast.success("Back online • Financial data remains 100% private on this device", {
                id: "pwa-online-toast",
                duration: 3500,
            });
        };

        const handleOffline = () => {
            setIsOffline(true);
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Service Worker update detection
        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker.ready.then((registration) => {
                // If a new worker is waiting, an update is already available
                if (registration.waiting) {
                    setUpdateAvailable(true);
                }

                registration.addEventListener("updatefound", () => {
                    const newWorker = registration.installing;
                    if (newWorker) {
                        newWorker.addEventListener("statechange", () => {
                            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                                setUpdateAvailable(true);
                            }
                        });
                    }
                });
            });
        }

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    const handleApplyUpdate = () => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistration().then((reg) => {
                if (reg?.waiting) {
                    reg.waiting.postMessage({ type: "SKIP_WAITING" });
                }
                window.location.reload();
            });
        } else {
            window.location.reload();
        }
    };

    return (
        <>
            {/* Offline Notification Banner */}
            {isOffline && (
                <div 
                    role="status"
                    aria-live="polite"
                    className="fixed top-2 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/95 dark:bg-slate-900/95 text-gray-200 text-xs font-medium shadow-lg backdrop-blur-md border border-slate-700/60 animate-fade-in pointer-events-none select-none"
                >
                    <WifiOffIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Offline mode</span>
                </div>
            )}

            {/* PWA App Code Update Banner */}
            {updateAvailable && (
                <div 
                    role="alert"
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-medium shadow-2xl border border-slate-700/40 dark:border-slate-200/40 animate-fade-in-up max-w-[90%] sm:max-w-md w-full"
                >
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="truncate">New app version ready to install</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleApplyUpdate}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-950 dark:bg-slate-900 dark:text-white rounded-xl font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                        <RefreshCwIcon className="w-3.5 h-3.5" />
                        Update App
                    </button>
                </div>
            )}
        </>
    );
}
