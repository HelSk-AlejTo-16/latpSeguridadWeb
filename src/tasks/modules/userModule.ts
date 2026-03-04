import { Module } from '@nestjs/common';
import { databaseProvider } from 'src/common/providers/database.provider';
import { PrismaService } from 'src/prisma.service';
import { UserController } from '../../users/controller/user.controller';
import { UserService } from '../../users/service/users.service';

@Module({
  controllers: [UserController],
  providers: [UserService, databaseProvider[0], PrismaService],
})
export class UserModule {}
