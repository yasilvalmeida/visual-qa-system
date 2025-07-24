import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { Image } from '../entities/image.entity';
import { Annotation } from '../entities/annotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Annotation])],
  controllers: [ExportController],
  providers: [ExportService],
})
export class ExportModule {} 