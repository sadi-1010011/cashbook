import { prisma } from "@/app/db";

export async function POST(request: Request) {

  // extract new transaction data
  const res = await request.json();
  
  console.log('saving data to DB !');
  console.log(res)

  // save to DB
  await prisma.transaction.create({
    data: {
      updatedAt: res.time,
      amount: res.amount,
      catogory: res.catogory,
      description: res.description,
      transactiontype: res.transactiontype
    }
  })
  
  // respond with success code 200

  return Response.json({
    message: "successfuly saved to DB !"
  }, {
    status: 200
  })
}