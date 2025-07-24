import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExportService } from './export.service';
import { ExportOptions } from './dto/export-options.dto';

@ApiTags('Export')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post(':imageId')
  @ApiOperation({ summary: 'Export image with annotations' })
  async exportImage(
    @Param('imageId') imageId: string,
    @Body() options: ExportOptions,
    @Res() res: Response,
  ) {
    const buffer = await this.exportService.exportImage(imageId, options);
    
    const contentType = options.format === 'png' ? 'image/png' : 'application/pdf';
    const filename = `export-${imageId}.${options.format}`;
    
    res.set({
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.send(buffer);
  }
} 