import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  role: string;

  @ApiProperty()
  content: string;
}
