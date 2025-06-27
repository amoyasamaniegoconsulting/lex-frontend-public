-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameFather" TEXT NOT NULL DEFAULT '',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "typeSourceId" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TypeSource" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "TypeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Origin" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "originName" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "extension" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Origin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Frequency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "days" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Frequency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyBalance" (
    "id" TEXT NOT NULL,
    "accountCode" INTEGER NOT NULL DEFAULT 0,
    "accountName" TEXT NOT NULL DEFAULT '',
    "thirdParty" TEXT NOT NULL DEFAULT '',
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "DailyBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyBalance" (
    "id" TEXT NOT NULL,
    "accountCode" INTEGER NOT NULL DEFAULT 0,
    "accountName" TEXT NOT NULL DEFAULT '',
    "thirdParty" TEXT NOT NULL DEFAULT '',
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "WeeklyBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyBalance" (
    "id" TEXT NOT NULL,
    "accountCode" INTEGER NOT NULL DEFAULT 0,
    "accountName" TEXT NOT NULL DEFAULT '',
    "thirdParty" TEXT NOT NULL DEFAULT '',
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "MonthlyBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BimonthlyBalance" (
    "id" TEXT NOT NULL,
    "accountCode" INTEGER NOT NULL DEFAULT 0,
    "accountName" TEXT NOT NULL DEFAULT '',
    "thirdParty" TEXT NOT NULL DEFAULT '',
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "BimonthlyBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuarterlyBalance" (
    "id" TEXT NOT NULL,
    "accountCode" INTEGER NOT NULL DEFAULT 0,
    "accountName" TEXT NOT NULL DEFAULT '',
    "thirdParty" TEXT NOT NULL DEFAULT '',
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "QuarterlyBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SemiannualBalance" (
    "id" TEXT NOT NULL,
    "accountCode" INTEGER NOT NULL DEFAULT 0,
    "accountName" TEXT NOT NULL DEFAULT '',
    "thirdParty" TEXT NOT NULL DEFAULT '',
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "SemiannualBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnualBalance" (
    "id" TEXT NOT NULL,
    "accountCode" INTEGER NOT NULL DEFAULT 0,
    "accountName" TEXT NOT NULL DEFAULT '',
    "thirdParty" TEXT NOT NULL DEFAULT '',
    "openingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "debits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "credits" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "closingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "originId" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdUser" TEXT NOT NULL DEFAULT 'bot',
    "lastModified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cutOffDate" TIMESTAMP(3),
    "frequencyId" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "AnnualBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Source_name_key" ON "Source"("name");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_typeSourceId_fkey" FOREIGN KEY ("typeSourceId") REFERENCES "TypeSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Origin" ADD CONSTRAINT "Origin_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Origin" ADD CONSTRAINT "Origin_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyBalance" ADD CONSTRAINT "DailyBalance_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyBalance" ADD CONSTRAINT "DailyBalance_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyBalance" ADD CONSTRAINT "WeeklyBalance_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyBalance" ADD CONSTRAINT "WeeklyBalance_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyBalance" ADD CONSTRAINT "MonthlyBalance_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyBalance" ADD CONSTRAINT "MonthlyBalance_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimonthlyBalance" ADD CONSTRAINT "BimonthlyBalance_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BimonthlyBalance" ADD CONSTRAINT "BimonthlyBalance_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuarterlyBalance" ADD CONSTRAINT "QuarterlyBalance_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuarterlyBalance" ADD CONSTRAINT "QuarterlyBalance_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemiannualBalance" ADD CONSTRAINT "SemiannualBalance_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemiannualBalance" ADD CONSTRAINT "SemiannualBalance_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnualBalance" ADD CONSTRAINT "AnnualBalance_originId_fkey" FOREIGN KEY ("originId") REFERENCES "Origin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnualBalance" ADD CONSTRAINT "AnnualBalance_frequencyId_fkey" FOREIGN KEY ("frequencyId") REFERENCES "Frequency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
