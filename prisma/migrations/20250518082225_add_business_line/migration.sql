-- CreateTable
CREATE TABLE "BusinessLine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BusinessLine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessLine_name_key" ON "BusinessLine"("name");
