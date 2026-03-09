import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './tasks/modules/taskModule';
import { UserModule } from './tasks/modules/userModule';


@Module({
  imports: [AuthModule,TaskModule,UserModule],

})
export class AppModule {}
