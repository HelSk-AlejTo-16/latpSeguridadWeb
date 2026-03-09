import { Module } from '@nestjs/common';
import { TaskController } from '../controller/task.controller';
import { TaskService } from '../service/task.service';
import { databaseProvider } from 'src/common/providers/database.provider';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, databaseProvider[0], PrismaService],
})
export class TaskModule {}