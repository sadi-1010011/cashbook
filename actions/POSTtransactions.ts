"use server"

export default async function POST_Transactions( newtransaction: any) {
    
    try {
        interface myreqbody {
            [key: string]: any,
        }

        console.log('saving new transaction data to backend !');

        const res = await fetch("https://kaayi.vercel.app/api/newTransaction", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            time: new Date().toISOString(),
            amount: newtransaction.amount ,
            catogory: newtransaction.catogory,
            description: newtransaction.description,
            transactiontype: newtransaction.transactiontype,
            }),
        });

        const result = await res.json()
        console.log(result);

        // if (!result.ok) return console.log("some error in saving data !"); // always logging issue!

    }

    catch (error) {
        console.log('somethin wrong in saving data, server side !');
        console.log(error);
    }             
    
}