import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Receiver user ID',
  })
  @IsMongoId()
  @IsNotEmpty()
  receiverId: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Message content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
