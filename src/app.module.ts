import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/modules/taskModule';
import { TaskController } from './tasks/controller/task.controller';
import { TaskService } from './tasks/service/task.service';
import { databaseProvider } from './common/providers/database.provider';

@Module({
 // imports: [AuthModule, TaskModule],
 // exports:['DATABASE_CONNECTION'],
  controllers: [TaskController],
  providers: [TaskService, databaseProvider[0]],
})
export class AppModule {}
