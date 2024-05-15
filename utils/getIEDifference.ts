// finds income-expense difference;

export default function getIncomeExpenseDiff(income: Number, expense: Number) {
    // check for types and ensure type safety
    const i = Number(income);
    const e = Number(expense);
    let difference: Number;

    // if any one is empty return the other
    if (i === 0 || e === 0) { if (i > e) { return i } else return e }
    if (i > e) {
        difference = i - e;
    } else {
        difference = 0;
    }
    return difference;
}