/*
  Warnings:

  - You are about to drop the column `createdUser` on the `AnnualBalance` table. All the data in the column will be lost.
  - You are about to drop the column `createdUser` on the `BimonthlyBalance` table. All the data in the column will be lost.
  - You are about to drop the column `createdUser` on the `DailyBalance` table. All the data in the column will be lost.
  - You are about to drop the column `createdUser` on the `MonthlyBalance` table. All the data in the column will be lost.
  - You are about to drop the column `createdUser` on the `Origin` table. All the data in the column will be lost.
  - You are about to drop the column `createdUser` on the `QuarterlyBalance` table. All the data in the column will be lost.
  - You are about to drop the column `createdUser` on the `SemiannualBalance` table. All the data in the column will be lost.
  - You are about to drop the column `createdUser` on the `WeeklyBalance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnnualBalance" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BimonthlyBalance" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DailyBalance" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyBalance" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Origin" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "QuarterlyBalance" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SemiannualBalance" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WeeklyBalance" DROP COLUMN "createdUser",
ADD COLUMN     "userId" TEXT NOT NULL DEFAULT 'bot',
ALTER COLUMN "createdDate" DROP NOT NULL,
ALTER COLUMN "lastModified" DROP NOT NULL;
