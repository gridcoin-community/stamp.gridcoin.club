// eslint-disable-next-line import/no-extraneous-dependencies
import { PrismaClient } from '.prisma/client';

const prisma = new PrismaClient();

export const getPrisma = (): PrismaClient => prisma;

export const disconnect = (): Promise<any> => prisma.$disconnect();
