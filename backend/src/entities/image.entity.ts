import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Annotation } from './annotation.entity';

@Entity('images')
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  path: string;

  @Column('bigint')
  size: number;

  @Column()
  width: number;

  @Column()
  height: number;

  @Column()
  mimeType: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isProcessed: boolean;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.images)
  @JoinColumn({ name: 'uploadedBy' })
  uploadedBy: User;

  @Column()
  uploadedById: string;

  @OneToMany(() => Annotation, (annotation) => annotation.image, {
    cascade: true,
  })
  annotations: Annotation[];
} 