"use server"

// get data from DB

import { prisma } from "@/app/db";

export default async function GET_Transaction_Expense_History() {
    return await prisma.transaction.findMany({
        where: {
            transactiontype: "expense"
        },
        orderBy: {
            createdAt: 'desc', // or 'asc' for descending order
        },
    });
}