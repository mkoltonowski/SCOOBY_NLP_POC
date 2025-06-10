import { ApiProperty } from '@nestjs/swagger';

export class QuestionDto {
  @ApiProperty()
  question: string;
}
