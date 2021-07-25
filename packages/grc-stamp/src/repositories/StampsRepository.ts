import { PrismaClient } from '@prisma/client';

export class StampsRepositoryClass {
  constructor(private prisma = new PrismaClient()) {}

  public async listStamps(): Promise<any> {
    const result = await this.prisma.stamps.findMany();
    return result;
  }
}

export const StampsRepository = new StampsRepositoryClass();
