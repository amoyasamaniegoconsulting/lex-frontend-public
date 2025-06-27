/*
  Warnings:

  - You are about to drop the column `userId` on the `CatalogScript` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CatalogWorkflow` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CatalogScript" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "CatalogWorkflow" DROP COLUMN "userId";
