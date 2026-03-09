import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDateString,
  IsNumber,
  IsArray,
  IsOptional,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe Updated' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: 'Male', enum: ['Male', 'Female', 'Other'] })
  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other'])
  gender?: string;

  @ApiPropertyOptional({ example: '1995-08-28' })
  @IsOptional()
  @IsDateString()
  birthday?: string;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(300)
  height?: number;

  @ApiPropertyOptional({ example: 70 })
  @IsOptional()
  @IsNumber()
  @Min(30)
  @Max(300)
  weight?: number;

  @ApiPropertyOptional({ example: ['Music', 'Travel', 'Photography'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ example: 'Updated about section' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({
    required: false,
    example: 'https://example.com/image.jpg',
    nullable: true,
    description: 'Profile image URL. Set to null to remove the image.',
  })
  @IsOptional()
  @IsString()
  @ValidateIf((object, value) => value !== null)
  profileImage?: string | null;
}
