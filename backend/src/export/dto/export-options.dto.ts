import { IsEnum, IsBoolean, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExportOptions {
  @ApiProperty({ enum: ['png', 'pdf'], example: 'png' })
  @IsEnum(['png', 'pdf'])
  format: 'png' | 'pdf';

  @ApiProperty({ example: true })
  @IsBoolean()
  includeAnnotations: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  includeMetadata: boolean;

  @ApiProperty({ example: 80, minimum: 1, maximum: 100, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  quality?: number;

  @ApiProperty({ example: 1.0, minimum: 0.1, maximum: 5.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(5.0)
  scale?: number;
} 