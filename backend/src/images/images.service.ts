import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { promises as fs } from 'fs';
import { join } from 'path';

import { Image } from '../entities/image.entity';
import { User } from '../entities/user.entity';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(file: Express.Multer.File, createImageDto: CreateImageDto, userId: string): Promise<Image> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get image dimensions and metadata
    const imageBuffer = await fs.readFile(file.path);
    const metadata = await sharp(imageBuffer).metadata();

    const image = this.imageRepository.create({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      width: metadata.width,
      height: metadata.height,
      mimeType: file.mimetype,
      description: createImageDto.description,
      uploadedBy: user,
    });

    return this.imageRepository.save(image);
  }

  async findAll(page: number = 1, limit: number = 10, filters?: any): Promise<{ data: Image[]; total: number }> {
    const queryBuilder = this.imageRepository
      .createQueryBuilder('image')
      .leftJoinAndSelect('image.uploadedBy', 'uploadedBy')
      .leftJoinAndSelect('image.annotations', 'annotations');

    // Apply filters
    if (filters?.search) {
      queryBuilder.andWhere(
        '(image.originalName ILIKE :search OR image.description ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.uploadedBy) {
      queryBuilder.andWhere('uploadedBy.id = :uploadedBy', { uploadedBy: filters.uploadedBy });
    }

    if (filters?.hasAnnotations !== undefined) {
      if (filters.hasAnnotations) {
        queryBuilder.andWhere('annotations.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('annotations.id IS NULL');
      }
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('image.uploadedAt', 'DESC')
      .getMany();

    return { data, total };
  }

  async findOne(id: string): Promise<Image> {
    const image = await this.imageRepository.findOne({
      where: { id },
      relations: ['uploadedBy', 'annotations'],
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    return image;
  }

  async update(id: string, updateImageDto: UpdateImageDto): Promise<Image> {
    const image = await this.findOne(id);
    
    Object.assign(image, updateImageDto);
    return this.imageRepository.save(image);
  }

  async remove(id: string): Promise<void> {
    const image = await this.findOne(id);
    
    // Delete the file from disk
    try {
      await fs.unlink(image.path);
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await this.imageRepository.remove(image);
  }

  async generateThumbnail(imageId: string, width: number = 200, height: number = 200): Promise<Buffer> {
    const image = await this.findOne(imageId);
    const imageBuffer = await fs.readFile(image.path);
    
    return sharp(imageBuffer)
      .resize(width, height, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();
  }

  async getImageStats(): Promise<any> {
    const totalImages = await this.imageRepository.count();
    const imagesWithAnnotations = await this.imageRepository
      .createQueryBuilder('image')
      .leftJoin('image.annotations', 'annotations')
      .where('annotations.id IS NOT NULL')
      .getCount();

    const totalSize = await this.imageRepository
      .createQueryBuilder('image')
      .select('SUM(image.size)', 'totalSize')
      .getRawOne();

    return {
      totalImages,
      imagesWithAnnotations,
      totalSize: parseInt(totalSize.totalSize) || 0,
      averageSize: totalImages > 0 ? (parseInt(totalSize.totalSize) || 0) / totalImages : 0,
    };
  }
} 