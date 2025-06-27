-- CreateTable
CREATE TABLE "DebtorConcept" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DebtorConcept_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DebtorConcept_name_key" ON "DebtorConcept"("name");
