-- CreateTable
CREATE TABLE "Todo" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "Todo_uid_key" ON "Todo"("uid");
