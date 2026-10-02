export type TransactionType = {
    id: string;
    amount: string | number;
    catogory: string; // Keeping the original typo for compatibility
    description: string;
    transactiontype: "income" | "expense" | "debt";
    createdAt: Date | string | number;
    updatedAt: Date | string | number;
};
