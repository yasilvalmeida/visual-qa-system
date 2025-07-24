import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Image } from './image.entity';

export enum AnnotationType {
  BOUNDING_BOX = 'boundingBox',
  POLYGON = 'polygon',
  POINT = 'point',
}

@Entity('annotations')
export class Annotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AnnotationType,
  })
  type: AnnotationType;

  @Column()
  label: string;

  @Column('decimal', { precision: 5, scale: 4 })
  confidence: number;

  @Column('jsonb')
  coordinates: Array<{ x: number; y: number }>;

  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @Column({ default: false })
  isReviewed: boolean;

  @Column({ nullable: true })
  reviewedBy?: string;

  @Column({ nullable: true })
  reviewNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Image, (image) => image.annotations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'imageId' })
  image: Image;

  @Column()
  imageId: string;
} 