import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EventLog } from '../entities/event-log.entity';
import { CreateEventLogDto } from './dto/create-event-log.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventLog)
    private eventLogRepository: Repository<EventLog>,
  ) {}

  async create(createEventLogDto: CreateEventLogDto): Promise<EventLog> {
    const eventLog = this.eventLogRepository.create(createEventLogDto);
    return this.eventLogRepository.save(eventLog);
  }

  async findAll(page: number = 1, limit: number = 50, filters?: any): Promise<{ data: EventLog[]; total: number }> {
    const queryBuilder = this.eventLogRepository
      .createQueryBuilder('eventLog')
      .leftJoinAndSelect('eventLog.user', 'user');

    // Apply filters
    if (filters?.userId) {
      queryBuilder.andWhere('eventLog.userId = :userId', { userId: filters.userId });
    }

    if (filters?.action) {
      queryBuilder.andWhere('eventLog.action = :action', { action: filters.action });
    }

    if (filters?.resourceType) {
      queryBuilder.andWhere('eventLog.resourceType = :resourceType', { resourceType: filters.resourceType });
    }

    if (filters?.dateFrom) {
      queryBuilder.andWhere('eventLog.timestamp >= :dateFrom', { dateFrom: filters.dateFrom });
    }

    if (filters?.dateTo) {
      queryBuilder.andWhere('eventLog.timestamp <= :dateTo', { dateTo: filters.dateTo });
    }

    const total = await queryBuilder.getCount();
    const data = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('eventLog.timestamp', 'DESC')
      .getMany();

    return { data, total };
  }

  async logUserAction(
    userId: string,
    action: string,
    resourceType: string,
    resourceId: string,
    metadata?: Record<string, any>,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<EventLog> {
    return this.create({
      userId,
      action,
      resourceType,
      resourceId,
      metadata,
      ipAddress,
      userAgent,
    });
  }

  async getEventStats(): Promise<any> {
    const totalEvents = await this.eventLogRepository.count();
    
    const actionStats = await this.eventLogRepository
      .createQueryBuilder('eventLog')
      .select('eventLog.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .groupBy('eventLog.action')
      .orderBy('count', 'DESC')
      .getRawMany();

    const resourceTypeStats = await this.eventLogRepository
      .createQueryBuilder('eventLog')
      .select('eventLog.resourceType', 'resourceType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('eventLog.resourceType')
      .orderBy('count', 'DESC')
      .getRawMany();

    const recentActivity = await this.eventLogRepository
      .createQueryBuilder('eventLog')
      .leftJoinAndSelect('eventLog.user', 'user')
      .orderBy('eventLog.timestamp', 'DESC')
      .limit(10)
      .getMany();

    return {
      totalEvents,
      actionStats,
      resourceTypeStats,
      recentActivity,
    };
  }
} 