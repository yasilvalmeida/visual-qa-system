import { IsEnum, IsString, IsNumber, IsArray, IsOptional, Min, Max, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AnnotationType } from '../../entities/annotation.entity';

class CoordinateDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  x: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  y: number;
}

export class CreateAnnotationDto {
  @ApiProperty({ example: 'image-id' })
  @IsString()
  imageId: string;

  @ApiProperty({ enum: AnnotationType, example: AnnotationType.BOUNDING_BOX })
  @IsEnum(AnnotationType)
  type: AnnotationType;

  @ApiProperty({ example: 'person' })
  @IsString()
  label: string;

  @ApiProperty({ example: 0.95, minimum: 0, maximum: 1 })
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiProperty({ type: [CoordinateDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  coordinates: CoordinateDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
} 