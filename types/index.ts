export type TransactionType = {
    id: string;
    amount: string | number;
    catogory: string; // Keeping the original typo for compatibility
    description: string;
    transactiontype: "income" | "expense" | "debt";
    createdAt: Date | string | number;
    updatedAt: Date | string | number;
};

export interface TransCardProps {
    id: string;
    amount?: number | string;
    date?: Date | string | number;
    type?: "income" | "expense" | "debt" | string;
    catogory?: string;
    description?: string;
    expanded?: boolean;
}

export interface TransCardToolsProps {
    id: string;
    date?: string;
    time?: string;
}

export interface BillType {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    status: 'paid' | 'unpaid';
    category?: string;
    createdAt?: number | string | Date;
}

export type BillTabOption = "upcoming" | "paid" | "all";

export interface BillDueBadge {
    text: string;
    className: string;
}

export interface BillCardProps {
    bill: BillType;
    index: number;
    format: (value: number) => string;
    getDueBadge: (dueDateStr: string, status: "paid" | "unpaid") => BillDueBadge | null;
    onEdit: (bill: BillType) => void;
    onDelete: (bill: BillType) => void;
    onToggleStatus: (bill: BillType) => void;
}

export interface SubscriptionType {
    id: string;
    name: string;
    amount: number;
    billingCycle: 'monthly' | 'yearly';
    category: string;
    nextBillingDate: string;
    status: 'paid' | 'unpaid';
    createdAt?: number | string | Date;
}

export interface SubscriptionDueBadge {
    text: string;
    className: string;
}

export interface SubscriptionCardProps {
    subscription: SubscriptionType;
    index: number;
    format: (value: number) => string;
    getDueBadge: (dueDateStr: string, status: "paid" | "unpaid") => SubscriptionDueBadge | null;
    onEdit: (subscription: SubscriptionType) => void;
    onDelete: (subscription: SubscriptionType) => void;
    onToggleStatus: (subscription: SubscriptionType) => void;
}

export interface AddBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (bill: BillType) => Promise<void> | void;
    onUpdate?: (id: string, updates: Partial<BillType>) => Promise<void> | void;
    initialBill?: BillType | null;
    currencySymbol: string;
}

export interface ConfirmBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    bill: BillType | null;
    currencySymbol: string;
    mode?: "status" | "delete";
}

export interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (subscription: SubscriptionType) => Promise<void> | void;
    onUpdate?: (id: string, updates: Partial<SubscriptionType>) => Promise<void> | void;
    initialSubscription?: SubscriptionType | null;
    currencySymbol: string;
}

export interface ConfirmSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    subscription: SubscriptionType | null;
    currencySymbol: string;
    mode?: "status" | "delete";
}

export interface BackupData {
    version: 1;
    exportedAt: string;
    transactions: TransactionType[];
    bills: BillType[];
    subscriptions: SubscriptionType[];
    budget: number | null;
}

export interface WipeDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    onBackup: () => void;
    transactionCount: number;
    billCount?: number;
    subscriptionCount?: number;
}

export interface StatsFilterState {
    type: "all" | "expense" | "income" | "debt";
    category: string;
    minAmount: string;
    maxAmount: string;
    dateRange: "all" | "year" | "custom";
    startDate: string;
    endDate: string;
}

export interface StatsFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: StatsFilterState;
    onApply: (filters: StatsFilterState) => void;
    onReset: () => void;
    availableCategories: string[];
    currencySymbol: string;
    matchingCount: number;
}

export interface NotificationType {
    id: string;
    title: string;
    message: string;
    date: string;
    category: "upcoming" | "feature" | "privacy" | "improvement";
    badgeText: string;
    actionHref?: string;
    actionLabel?: string;
    isUnread?: boolean;
}


