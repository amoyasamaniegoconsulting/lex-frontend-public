-- CreateTable
CREATE TABLE "DebtType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DebtType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdentificationType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "IdentificationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderConcept" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProviderConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImpairmentConcept" (
    "id" SERIAL NOT NULL,
    "minDay" INTEGER NOT NULL,
    "maxDay" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ImpairmentConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubsequentMeasurement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SubsequentMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MunicipalCode" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MunicipalCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DebtType_name_key" ON "DebtType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IdentificationType_name_key" ON "IdentificationType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderConcept_name_key" ON "ProviderConcept"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SubsequentMeasurement_name_key" ON "SubsequentMeasurement"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MunicipalCode_name_key" ON "MunicipalCode"("name");
