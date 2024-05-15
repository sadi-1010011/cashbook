"use server"

// get data from DB

import { prisma } from "@/app/db";

export default async function GET_Transaction_Income_History() {
    return await prisma.transaction.findMany({
        where: {
            transactiontype: "income"
        },
        orderBy: {
            createdAt: 'desc', // or 'asc' for descending order
        },
    });
}