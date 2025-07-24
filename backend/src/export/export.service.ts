import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { PDFDocument, rgb } from 'pdf-lib';
import { createCanvas, loadImage } from 'canvas';
import { promises as fs } from 'fs';

import { Image } from '../entities/image.entity';
import { Annotation } from '../entities/annotation.entity';
import { ExportOptions } from './dto/export-options.dto';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Image)
    private imageRepository: Repository<Image>,
    @InjectRepository(Annotation)
    private annotationRepository: Repository<Annotation>,
  ) {}

  async exportImage(
    imageId: string,
    options: ExportOptions,
  ): Promise<Buffer> {
    const image = await this.imageRepository.findOne({
      where: { id: imageId },
      relations: ['annotations'],
    });

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    if (options.format === 'png') {
      return this.exportToPNG(image, options);
    } else {
      return this.exportToPDF(image, options);
    }
  }

  private async exportToPNG(image: Image, options: ExportOptions): Promise<Buffer> {
    const imageBuffer = await fs.readFile(image.path);
    const img = await loadImage(imageBuffer);
    
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    // Draw the original image
    ctx.drawImage(img, 0, 0);

    if (options.includeAnnotations) {
      // Draw annotations
      for (const annotation of image.annotations) {
        this.drawAnnotation(ctx, annotation, image.width, image.height);
      }
    }

    if (options.includeMetadata) {
      // Draw metadata overlay
      this.drawMetadata(ctx, image, image.width, image.height);
    }

    return canvas.toBuffer('image/png');
  }

  private async exportToPDF(image: Image, options: ExportOptions): Promise<Buffer> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([image.width, image.height]);

    // Add the image
    const imageBuffer = await fs.readFile(image.path);
    const pdfImage = await pdfDoc.embedPng(imageBuffer);
    page.drawImage(pdfImage, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });

    if (options.includeAnnotations) {
      // Add annotations
      for (const annotation of image.annotations) {
        this.addAnnotationToPDF(page, annotation, image.width, image.height);
      }
    }

    if (options.includeMetadata) {
      // Add metadata
      this.addMetadataToPDF(page, image, image.width, image.height);
    }

    return Buffer.from(await pdfDoc.save());
  }

  private drawAnnotation(
    ctx: any,
    annotation: Annotation,
    imageWidth: number,
    imageHeight: number,
  ): void {
    ctx.strokeStyle = this.getAnnotationColor(annotation.confidence);
    ctx.lineWidth = 2;
    ctx.fillStyle = this.getAnnotationColor(annotation.confidence);
    ctx.font = '14px Arial';

    switch (annotation.type) {
      case 'boundingBox':
        if (annotation.coordinates.length >= 2) {
          const [topLeft, bottomRight] = annotation.coordinates;
          const width = bottomRight.x - topLeft.x;
          const height = bottomRight.y - topLeft.y;

          ctx.strokeRect(topLeft.x, topLeft.y, width, height);
          ctx.fillText(
            `${annotation.label} (${(annotation.confidence * 100).toFixed(1)}%)`,
            topLeft.x,
            topLeft.y - 5,
          );
        }
        break;

      case 'polygon':
        if (annotation.coordinates.length >= 3) {
          ctx.beginPath();
          ctx.moveTo(annotation.coordinates[0].x, annotation.coordinates[0].y);
          
          for (let i = 1; i < annotation.coordinates.length; i++) {
            ctx.lineTo(annotation.coordinates[i].x, annotation.coordinates[i].y);
          }
          
          ctx.closePath();
          ctx.stroke();
          
          // Draw label at the center of the polygon
          const centerX = annotation.coordinates.reduce((sum, coord) => sum + coord.x, 0) / annotation.coordinates.length;
          const centerY = annotation.coordinates.reduce((sum, coord) => sum + coord.y, 0) / annotation.coordinates.length;
          
          ctx.fillText(
            `${annotation.label} (${(annotation.confidence * 100).toFixed(1)}%)`,
            centerX,
            centerY,
          );
        }
        break;

      case 'point':
        if (annotation.coordinates.length >= 1) {
          const point = annotation.coordinates[0];
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillText(
            `${annotation.label} (${(annotation.confidence * 100).toFixed(1)}%)`,
            point.x + 10,
            point.y,
          );
        }
        break;
    }
  }

  private addAnnotationToPDF(
    page: any,
    annotation: Annotation,
    imageWidth: number,
    imageHeight: number,
  ): void {
    const color = this.getAnnotationColor(annotation.confidence);

    switch (annotation.type) {
      case 'boundingBox':
        if (annotation.coordinates.length >= 2) {
          const [topLeft, bottomRight] = annotation.coordinates;
          const width = bottomRight.x - topLeft.x;
          const height = bottomRight.y - topLeft.y;

          page.drawRectangle({
            x: topLeft.x,
            y: imageHeight - topLeft.y - height,
            width,
            height,
            borderColor: color,
            borderWidth: 2,
          });

          page.drawText(`${annotation.label} (${(annotation.confidence * 100).toFixed(1)}%)`, {
            x: topLeft.x,
            y: imageHeight - topLeft.y + 5,
            size: 12,
            color: color,
          });
        }
        break;

      // Add similar implementations for polygon and point
    }
  }

  private drawMetadata(ctx: any, image: Image, imageWidth: number, imageHeight: number): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 300, 100);

    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText(`Image: ${image.originalName}`, 20, 30);
    ctx.fillText(`Size: ${image.width}x${image.height}`, 20, 50);
    ctx.fillText(`Uploaded: ${image.uploadedAt.toLocaleDateString()}`, 20, 70);
    ctx.fillText(`Annotations: ${image.annotations.length}`, 20, 90);
  }

  private addMetadataToPDF(page: any, image: Image, imageWidth: number, imageHeight: number): void {
    page.drawText(`Image: ${image.originalName}`, {
      x: 10,
      y: imageHeight - 30,
      size: 10,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Size: ${image.width}x${image.height}`, {
      x: 10,
      y: imageHeight - 45,
      size: 10,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Uploaded: ${image.uploadedAt.toLocaleDateString()}`, {
      x: 10,
      y: imageHeight - 60,
      size: 10,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Annotations: ${image.annotations.length}`, {
      x: 10,
      y: imageHeight - 75,
      size: 10,
      color: rgb(0, 0, 0),
    });
  }

  private getAnnotationColor(confidence: number): string {
    if (confidence >= 0.8) return '#00ff00'; // Green for high confidence
    if (confidence >= 0.6) return '#ffff00'; // Yellow for medium confidence
    return '#ff0000'; // Red for low confidence
  }
} 