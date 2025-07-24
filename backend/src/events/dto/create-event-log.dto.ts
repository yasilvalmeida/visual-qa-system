import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventLogDto {
  @ApiProperty({ example: 'user-id' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'CREATE' })
  @IsString()
  action: string;

  @ApiProperty({ example: 'IMAGE' })
  @IsString()
  resourceType: string;

  @ApiProperty({ example: 'image-id' })
  @IsString()
  resourceId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;
} 