import Localbase from "localbase";

const db = new Localbase('kaayidb');
db.config.debug = false

type TransactionType = {
    id: string;
    amount: String;
    catogory: string;
    description: string;
    transactiontype: string;
    createdAt: number;
    updatedAt: Date;
};

export default function addNewTransaction(newTransaction: TransactionType): void {
    // add transaction to db
    db.collection('alltransactions').add(newTransaction);
}
