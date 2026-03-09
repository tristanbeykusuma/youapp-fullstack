import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Display name',
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    example: 'Male',
    enum: ['Male', 'Female', 'Other'],
  })
  @IsEnum(['Male', 'Female', 'Other'])
  gender: string;

  @ApiProperty({
    example: '1995-08-28',
    description: 'Birthday in ISO format (YYYY-MM-DD)',
  })
  @IsDateString()
  birthday: string;

  @ApiProperty({
    example: 175,
    description: 'Height in centimeters',
    minimum: 100,
    maximum: 300,
  })
  @IsNumber()
  @Min(100)
  @Max(300)
  height: number;

  @ApiProperty({
    example: 69,
    description: 'Weight in kilograms',
    minimum: 30,
    maximum: 300,
  })
  @IsNumber()
  @Min(30)
  @Max(300)
  weight: number;

  @ApiProperty({
    example: ['Music', 'Basketball', 'Fitness'],
    description: 'List of interests',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiProperty({
    example: 'I love traveling and music',
    required: false,
  })
  @IsOptional()
  @IsString()
  about?: string;
}
