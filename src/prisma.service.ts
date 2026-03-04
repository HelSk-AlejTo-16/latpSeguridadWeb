import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg'; // Verifica si es @prisma/adapter-pg o desde client
import * as dotenv from 'dotenv';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // <--- IMPORTACIÓN CORREGIDA

dotenv.config()

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}