import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatasourceModule } from '../datasource/datasource.module';
import { ApplicationModule } from '../application/application.module';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DatasourceModule, CqrsModule, ApplicationModule],
  providers: [],
  controllers: [UserController],
  exports: [],
})
export class InterfaceModule {}
