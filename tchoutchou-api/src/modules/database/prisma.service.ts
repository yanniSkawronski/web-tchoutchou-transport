import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient {
  public constructor() {
    super({
      adapter: new PrismaPg(
        new Pool({
          connectionString:
            process.env.DATABASE_URL ??
            'postgresql://postgres:postgres@db:5432/tchoutchou',
        }),
      ),
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
