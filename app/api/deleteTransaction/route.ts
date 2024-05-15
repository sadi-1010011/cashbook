// delete a transaction

import { prisma } from "@/app/db";

export async function DELETE(request: Request) {

  console.log('deleting data from DB !');

  const res = await request.json();
  
 
  // delete from DB

  await prisma.transaction.delete({
    where: {
        id: res.id,
    }
  });
  
  // respond with success code 200

  return Response.json({
    message: "successfuly Deleted transaction from DB !"
  }, {
    status: 200
  })
}