import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DatasourceModule } from '../datasource/datasource.module';
import { ApplicationModule } from '../application/application.module';
import { UserController } from './controllers/user.controller';
import { MessageGateway } from './websockets/message.gateway';

@Module({
  imports: [DatasourceModule, CqrsModule, ApplicationModule],
  providers: [MessageGateway],
  controllers: [UserController],
  exports: [],
})
export class InterfaceModule {}
