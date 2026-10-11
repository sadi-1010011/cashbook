export interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
    locale: string;
    flag: string;
    decimals: number;
    rateFromBase: number; // multiplier from base (INR) to this currency: target = base * rateFromBase
    inrEquivalent: number; // how much 1 unit of this currency equals in INR (e.g., 1 USD = ₹86.20)
}

export const BASE_CURRENCY_CODE = 'INR';

export const CURRENCY_DICTIONARY: Record<string, CurrencyInfo> = {
    INR: {
        code: 'INR',
        symbol: '₹',
        name: 'Indian Rupee',
        locale: 'en-IN',
        flag: '🇮🇳',
        decimals: 0,
        rateFromBase: 1,
        inrEquivalent: 1,
    },
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        locale: 'en-US',
        flag: '🇺🇸',
        decimals: 2,
        rateFromBase: 0.0116,
        inrEquivalent: 86.20,
    },
    EUR: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        locale: 'de-DE',
        flag: '🇪🇺',
        decimals: 2,
        rateFromBase: 0.0107,
        inrEquivalent: 93.45,
    },
    GBP: {
        code: 'GBP',
        symbol: '£',
        name: 'British Pound',
        locale: 'en-GB',
        flag: '🇬🇧',
        decimals: 2,
        rateFromBase: 0.0091,
        inrEquivalent: 109.80,
    },
    AED: {
        code: 'AED',
        symbol: 'AED ',
        name: 'UAE Dirham',
        locale: 'en-AE',
        flag: '🇦🇪',
        decimals: 2,
        rateFromBase: 0.0426,
        inrEquivalent: 23.47,
    },
    JPY: {
        code: 'JPY',
        symbol: '¥',
        name: 'Japanese Yen',
        locale: 'ja-JP',
        flag: '🇯🇵',
        decimals: 0,
        rateFromBase: 1.78,
        inrEquivalent: 0.56,
    },
    CAD: {
        code: 'CAD',
        symbol: 'C$',
        name: 'Canadian Dollar',
        locale: 'en-CA',
        flag: '🇨🇦',
        decimals: 2,
        rateFromBase: 0.0162,
        inrEquivalent: 61.70,
    },
    AUD: {
        code: 'AUD',
        symbol: 'A$',
        name: 'Australian Dollar',
        locale: 'en-AU',
        flag: '🇦🇺',
        decimals: 2,
        rateFromBase: 0.0181,
        inrEquivalent: 55.25,
    },
};

export const SUPPORTED_CURRENCIES = Object.values(CURRENCY_DICTIONARY);
