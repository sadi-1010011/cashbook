// finds income - expense difference (Total Balance)

export default function getIncomeExpenseDiff(income: number = 0, expense: number = 0): number {
    const i = Number(income) || 0;
    const e = Number(expense) || 0;
    return i - e;
}