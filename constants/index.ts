import TravelIcon from "@/assets/travelicon.png";
import FoodIcon from "@/assets/foodicon.png";
import MoviesIcon from "@/assets/entertainmenticon.png";
import MedicineIcon from "@/assets/medicine.png";
import HaircutIcon from "@/assets/haircut.png";
import SalaryIcon from "@/assets/salary.png";
import MoneyIcon from "@/assets/money.png";
import OthersIcon from "@/assets/others.png";
import EmiIcon from "@/assets/emi.png";
import RechargeIcon from "@/assets/recharge.png";
import BeautyIcon from "@/assets/beauty.png";
import { StaticImageData } from "next/image";
import { StatsFilterState } from "@/types";

export const CATEGORY_ICONS: Record<string, StaticImageData> = {
    'travel': TravelIcon,
    'food': FoodIcon,
    'movies': MoviesIcon,
    'medicine': MedicineIcon,
    'haircut': HaircutIcon,
    'others': OthersIcon,
    'other expense': OthersIcon,
    'other income': OthersIcon,
    'salary': SalaryIcon,
    'tip': MoneyIcon,
    'emi': EmiIcon,
    'recharge': RechargeIcon,
    'beauty': BeautyIcon,
};

export const DEFAULT_CATEGORY_ICON = OthersIcon;

export const EXPENSE_CATEGORIES = ["food", "travel", "movies", "haircut", "medicine", "emi", "recharge", "beauty", "other expense"];
export const INCOME_CATEGORIES = ["salary", "tip", "other income"];
export const DEBT_CATEGORIES = ["borrowed", "lent"];
export const TRANSACTION_TYPES = ["income", "expense", "debt"] as const;

// Bills presets
export const PRESET_BILLS = [
    { title: "Electricity Bill", category: "electricity" },
    { title: "Internet / Wi-Fi", category: "internet" },
    { title: "Water Bill", category: "water" },
    { title: "House Rent", category: "rent" },
    { title: "Credit Card", category: "card" },
    { title: "Mobile Recharge", category: "recharge" },
    { title: "Gas Bill", category: "gas" },
];

export const BILL_CATEGORIES = [
    "utilities",
    "electricity",
    "internet",
    "water",
    "rent",
    "card",
    "recharge",
    "gas",
    "other",
];

// Subscriptions presets and categories
export const SUBSCRIPTION_CATEGORIES = ["Entertainment", "Productivity", "Utilities", "Software", "Other"];

export const PRESET_SUBSCRIPTIONS = [
    { name: "Netflix", category: "Entertainment", cycle: "monthly" as const },
    { name: "Spotify", category: "Entertainment", cycle: "monthly" as const },
    { name: "YouTube Premium", category: "Entertainment", cycle: "monthly" as const },
    { name: "ChatGPT Plus", category: "Software", cycle: "monthly" as const },
    { name: "iCloud", category: "Utilities", cycle: "monthly" as const },
    { name: "Notion", category: "Productivity", cycle: "yearly" as const },
    { name: "Amazon Prime", category: "Entertainment", cycle: "yearly" as const },
    { name: "AWS", category: "Utilities", cycle: "monthly" as const },
    { name: "GitHub", category: "Productivity", cycle: "monthly" as const },
];

// Statistics filter initial state
export const INITIAL_FILTER_STATE: StatsFilterState = {
    type: "all",
    category: "all",
    minAmount: "",
    maxAmount: "",
    dateRange: "all",
    startDate: "",
    endDate: "",
};
