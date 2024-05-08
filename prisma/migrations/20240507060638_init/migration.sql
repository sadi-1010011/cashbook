-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cashin" BOOLEAN NOT NULL,
    "date" DATETIME NOT NULL
);
