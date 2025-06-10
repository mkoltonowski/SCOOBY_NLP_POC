import { Module } from '@nestjs/common';
import { Handlers } from './query/handlers';
import { ConfigModule } from '@nestjs/config';
import { CommandHandlers } from './command/handlers';
import { VectorStoreService } from './service/vector-store.service';
import { ChatService } from './service/chatbot.service';

@Module({
  imports: [ConfigModule],
  providers: [...Handlers, ...CommandHandlers, VectorStoreService, ChatService],
  exports: [...Handlers, ...CommandHandlers, ChatService],
})
export class SeriesApplicationModule {}
