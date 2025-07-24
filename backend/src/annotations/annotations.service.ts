import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Annotation, AnnotationType } from '../entities/annotation.entity';
import { Image } from '../entities/image.entity';
import { CreateAnnotationDto } from './dto/create-annotation.dto';
import { UpdateAnnotationDto } from './dto/update-annotation.dto';

@Injectable()
export class AnnotationsService {
  constructor(
    @InjectRepository(Annotation)
    private annotationRepository: Repository<Annotation>,
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
  ) {}

  async create(createAnnotationDto: CreateAnnotationDto): Promise<Annotation> {
    const image = await this.imageRepository.findOne({
      where: { id: createAnnotationDto.imageId },
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    const annotation = this.annotationRepository.create(createAnnotationDto);
    return this.annotationRepository.save(annotation);
  }

  async findAll(filters?: any): Promise<Annotation[]> {
    const queryBuilder = this.annotationRepository
      .createQueryBuilder('annotation')
      .leftJoinAndSelect('annotation.image', 'image');

    // Apply filters
    if (filters?.imageId) {
      queryBuilder.andWhere('annotation.imageId = :imageId', {
        imageId: filters.imageId,
      });
    }

    if (filters?.type) {
      queryBuilder.andWhere('annotation.type = :type', { type: filters.type });
    }

    if (filters?.label) {
      queryBuilder.andWhere('annotation.label ILIKE :label', {
        label: `%${filters.label}%`,
      });
    }

    if (filters?.confidenceMin !== undefined) {
      queryBuilder.andWhere('annotation.confidence >= :confidenceMin', {
        confidenceMin: filters.confidenceMin,
      });
    }

    if (filters?.confidenceMax !== undefined) {
      queryBuilder.andWhere('annotation.confidence <= :confidenceMax', {
        confidenceMax: filters.confidenceMax,
      });
    }

    if (filters?.isReviewed !== undefined) {
      queryBuilder.andWhere('annotation.isReviewed = :isReviewed', {
        isReviewed: filters.isReviewed,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Annotation> {
    const annotation = await this.annotationRepository.findOne({
      where: { id },
      relations: ['image'],
    });

    if (!annotation) {
      throw new NotFoundException('Annotation not found');
    }

    return annotation;
  }

  async update(id: string, updateAnnotationDto: UpdateAnnotationDto): Promise<Annotation> {
    const annotation = await this.findOne(id);
    
    Object.assign(annotation, updateAnnotationDto);
    return this.annotationRepository.save(annotation);
  }

  async remove(id: string): Promise<void> {
    const annotation = await this.findOne(id);
    await this.annotationRepository.remove(annotation);
  }

  async findByImageId(imageId: string): Promise<Annotation[]> {
    return this.annotationRepository.find({
      where: { imageId },
      order: { createdAt: 'ASC' },
    });
  }

  async getAnnotationStats(): Promise<any> {
    const totalAnnotations = await this.annotationRepository.count();
    const reviewedAnnotations = await this.annotationRepository.count({
      where: { isReviewed: true },
    });

    const typeStats = await this.annotationRepository
      .createQueryBuilder('annotation')
      .select('annotation.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('annotation.type')
      .getRawMany();

    const labelStats = await this.annotationRepository
      .createQueryBuilder('annotation')
      .select('annotation.label', 'label')
      .addSelect('COUNT(*)', 'count')
      .groupBy('annotation.label')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalAnnotations,
      reviewedAnnotations,
      reviewRate: totalAnnotations > 0 ? (reviewedAnnotations / totalAnnotations) * 100 : 0,
      typeStats,
      labelStats,
    };
  }

  async bulkUpdate(ids: string[], updateData: Partial<UpdateAnnotationDto>): Promise<void> {
    await this.annotationRepository
      .createQueryBuilder()
      .update(Annotation)
      .set(updateData)
      .whereInIds(ids)
      .execute();
  }
} 