import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ApplicationModule } from '../application/application.module';
import { UserController } from './controllers/user.controller';
import { MessageGateway } from './websockets/message.gateway';
import { SeriesController } from './controllers/series.controller';

@Module({
  imports: [CqrsModule, ApplicationModule],
  providers: [MessageGateway],
  controllers: [UserController, SeriesController],
  exports: [],
})
export class InterfaceModule {}
