import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @ApiProperty({ required: false, description: 'Image description' })
  @IsOptional()
  @IsString()
  description?: string;
} 