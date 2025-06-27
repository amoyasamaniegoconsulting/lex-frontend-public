import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  // Crear el cliente de Prisma directamente sin el adaptador de Neon
  const prisma = new PrismaClient({
    datasources: {
      db: { url: connectionString },
    },
  });

  return prisma;
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
