import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnnotationsService } from './annotations.service';
import { CreateAnnotationDto } from './dto/create-annotation.dto';
import { UpdateAnnotationDto } from './dto/update-annotation.dto';

@ApiTags('Annotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('annotations')
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new annotation' })
  async create(@Body() createAnnotationDto: CreateAnnotationDto) {
    return this.annotationsService.create(createAnnotationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all annotations with filters' })
  async findAll(
    @Query('imageId') imageId?: string,
    @Query('type') type?: string,
    @Query('label') label?: string,
    @Query('confidenceMin') confidenceMin?: string,
    @Query('confidenceMax') confidenceMax?: string,
    @Query('isReviewed') isReviewed?: string,
  ) {
    const filters = {
      imageId,
      type,
      label,
      confidenceMin: confidenceMin ? parseFloat(confidenceMin) : undefined,
      confidenceMax: confidenceMax ? parseFloat(confidenceMax) : undefined,
      isReviewed: isReviewed === 'true',
    };

    return this.annotationsService.findAll(filters);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get annotation statistics' })
  async getStats() {
    return this.annotationsService.getAnnotationStats();
  }

  @Get('image/:imageId')
  @ApiOperation({ summary: 'Get annotations by image ID' })
  async findByImageId(@Param('imageId') imageId: string) {
    return this.annotationsService.findByImageId(imageId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get annotation by ID' })
  async findOne(@Param('id') id: string) {
    return this.annotationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update annotation' })
  async update(
    @Param('id') id: string,
    @Body() updateAnnotationDto: UpdateAnnotationDto,
  ) {
    return this.annotationsService.update(id, updateAnnotationDto);
  }

  @Patch('bulk')
  @ApiOperation({ summary: 'Bulk update annotations' })
  async bulkUpdate(
    @Body() body: { ids: string[]; updateData: Partial<UpdateAnnotationDto> },
  ) {
    await this.annotationsService.bulkUpdate(body.ids, body.updateData);
    return { message: 'Annotations updated successfully' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete annotation' })
  async remove(@Param('id') id: string) {
    return this.annotationsService.remove(id);
  }
} 