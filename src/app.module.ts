import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/modules/taskModule';
import { UserModule } from './tasks/modules/userModule';
import { PrismaService } from './common/services/prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception-filter';


@Module({
  imports: [AuthModule,TaskModule,UserModule],
  controllers: [],
  providers: [
    PrismaService, 
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter, 
    },
  ],
})  

export class AppModule {}
