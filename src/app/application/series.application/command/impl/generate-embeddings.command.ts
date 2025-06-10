import { Command } from '@nestjs/cqrs';

export class GenerateEmbeddingsCommand extends Command<void> {
  constructor() {
    super();
  }
}
