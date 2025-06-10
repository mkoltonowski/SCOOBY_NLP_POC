import { Body, Controller, Get, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FetchSeriesQuery } from '../../application/series.application/query/impl';
import { GenerateEmbeddingsCommand } from '../../application/series.application/command/impl/generate-embeddings.command';
import { ChatService } from '../../application/series.application/service/chatbot.service';

import { QuestionDto } from '../../application/dtos/question.dto';

@Controller('series')
export class SeriesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly chatService: ChatService,
  ) {}

  @Get('/')
  public async getSeries() {
    return this.queryBus.execute(new FetchSeriesQuery());
  }

  @Post('/ask')
  public async askChat(@Body() payload: QuestionDto) {
    return this.chatService.ask(payload.question);
  }

  @Post('/embeddings')
  public async generateEmbeddings() {
    return this.commandBus.execute(new GenerateEmbeddingsCommand());
  }
}
