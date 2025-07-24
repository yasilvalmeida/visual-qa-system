import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ImagesService } from './images.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@ApiTags('Images')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
    @GetUser('id') userId: string,
  ) {
    return this.imagesService.create(file, createImageDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images with pagination and filters' })
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('uploadedBy') uploadedBy?: string,
    @Query('hasAnnotations') hasAnnotations?: string,
  ) {
    const filters = {
      search,
      uploadedBy,
      hasAnnotations: hasAnnotations === 'true',
    };

    return this.imagesService.findAll(
      parseInt(page),
      parseInt(limit),
      filters,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get image statistics' })
  async getStats() {
    return this.imagesService.getImageStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get image by ID' })
  async findOne(@Param('id') id: string) {
    return this.imagesService.findOne(id);
  }

  @Get(':id/thumbnail')
  @ApiOperation({ summary: 'Get image thumbnail' })
  async getThumbnail(
    @Param('id') id: string,
    @Query('width') width: string = '200',
    @Query('height') height: string = '200',
    @Res() res: Response,
  ) {
    const thumbnail = await this.imagesService.generateThumbnail(
      id,
      parseInt(width),
      parseInt(height),
    );

    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Length': thumbnail.length.toString(),
    });

    res.send(thumbnail);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update image metadata' })
  async update(
    @Param('id') id: string,
    @Body() updateImageDto: UpdateImageDto,
  ) {
    return this.imagesService.update(id, updateImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete image' })
  async remove(@Param('id') id: string) {
    return this.imagesService.remove(id);
  }
} 