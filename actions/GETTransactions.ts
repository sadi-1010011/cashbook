"use server"

//  get data from DB

import { prisma } from "@/app/db";

export default async function GET_Transactions() {
    return await prisma.transaction.findMany({
        orderBy: {
            createdAt: 'desc' // asc for ascending
        }
    });
}