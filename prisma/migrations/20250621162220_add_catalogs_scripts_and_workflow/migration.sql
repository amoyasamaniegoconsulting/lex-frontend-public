-- CreateTable
CREATE TABLE "CatalogWorkflow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'bot',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatalogWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogScript" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT 'bot',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "template" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatalogScript_pkey" PRIMARY KEY ("id")
);
