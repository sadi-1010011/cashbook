"use server"

// delete request
export default async function DELETE_Transaction(id: any) {

                        
    try {
        console.log('deleting: ', id);
            const res = await fetch("http://localhost:3000/api/deleteTransaction", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                }),
            });

            const result = await res.json();
            console.log(result);
    }         

    catch (error) {
        console.log('somethin wrong in deleting data, server side !');
        console.log(error);
    }
}
