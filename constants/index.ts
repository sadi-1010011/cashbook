import TravelIcon from "@/assets/travelicon.png";
import FoodIcon from "@/assets/foodicon.png";
import MoviesIcon from "@/assets/entertainmenticon.png";
import MedicineIcon from "@/assets/medicine.png";
import HaircutIcon from "@/assets/haircut.png";
import SalaryIcon from "@/assets/salary.png";
import MoneyIcon from "@/assets/money.png";
import OthersIcon from "@/assets/others.png";
import { StaticImageData } from "next/image";

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
};

export const DEFAULT_CATEGORY_ICON = OthersIcon;

export const EXPENSE_CATEGORIES = ["food", "travel", "movies", "haircut", "medicine", "other expense"];
export const INCOME_CATEGORIES = ["salary", "tip", "other income"];
export const DEBT_CATEGORIES = ["borrowed", "lent"];
export const TRANSACTION_TYPES = ["income", "expense", "debt"];
