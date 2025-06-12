import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from './message.dto';

export class QuestionDto {
  @ApiProperty({ isArray: true, type: MessageDto })
  messages: MessageDto[];
}
