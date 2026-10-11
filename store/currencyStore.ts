import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CURRENCY_DICTIONARY, CurrencyInfo, BASE_CURRENCY_CODE } from '@/constants/currencies';

interface CurrencyState {
    currentCurrency: string;
    currencyInfo: CurrencyInfo;
    setCurrency: (code: string) => void;
    convert: (amountInBase: number) => number;
    convertToBase: (amountInCurrent: number) => number;
    format: (amountInBase: number, options?: { showSymbol?: boolean; showCode?: boolean }) => string;
}

export const useCurrencyStore = create<CurrencyState>()(
    persist(
        (set, get) => ({
            currentCurrency: BASE_CURRENCY_CODE,
            currencyInfo: CURRENCY_DICTIONARY[BASE_CURRENCY_CODE],

            setCurrency: (code: string) => {
                const info = CURRENCY_DICTIONARY[code] || CURRENCY_DICTIONARY[BASE_CURRENCY_CODE];
                set({
                    currentCurrency: info.code,
                    currencyInfo: info,
                });
            },

            convert: (amountInBase: number) => {
                const num = Number(amountInBase) || 0;
                const { currencyInfo } = get();
                const rate = currencyInfo?.rateFromBase ?? 1;
                const decimals = currencyInfo?.decimals ?? 2;
                const converted = num * rate;
                return Number(converted.toFixed(decimals));
            },

            convertToBase: (amountInCurrent: number) => {
                const num = Number(amountInCurrent) || 0;
                const { currencyInfo } = get();
                const rate = currencyInfo?.rateFromBase ?? 1;
                if (!rate || rate === 0) return num;
                return Math.round((num / rate) * 100) / 100;
            },

            format: (amountInBase: number, options = { showSymbol: true, showCode: false }) => {
                const { currencyInfo, convert } = get();
                const converted = convert(amountInBase);
                const locale = currencyInfo?.locale || 'en-IN';
                const decimals = currencyInfo?.decimals ?? 2;
                const symbol = options.showSymbol !== false ? (currencyInfo?.symbol || '₹') : '';

                const formattedNum = converted.toLocaleString(locale, {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                });

                let result = `${symbol}${formattedNum}`;
                if (options.showCode) {
                    result += ` ${currencyInfo?.code || ''}`;
                }
                return result;
            },
        }),
        {
            name: 'kaayi_currency_storage',
            partialize: (state) => ({ currentCurrency: state.currentCurrency }),
            onRehydrateStorage: () => (state) => {
                if (state && state.currentCurrency) {
                    const info = CURRENCY_DICTIONARY[state.currentCurrency] || CURRENCY_DICTIONARY[BASE_CURRENCY_CODE];
                    state.currencyInfo = info;
                }
            },
        }
    )
);
