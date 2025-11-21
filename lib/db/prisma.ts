/**
 * Prisma 数据库实现
 *
 * 使用方法：
 * 1. 运行 `npx prisma migrate dev` 初始化数据库
 * 2. 在 lib/db/index.ts 中切换到 prismaDB
 *
 * Linus 原则：简单直接，不要过度抽象
 */

import { PrismaClient } from '@prisma/client';
import { Database } from './interface';
import {
  TripWithDetails,
  ChecklistItem,
  PackingItem,
} from '@/lib/types/template';

/**
 * 防止开发模式下创建多个 Prisma 实例
 */
declare global {
  var __prisma: PrismaClient | undefined;
}

const prisma = global.__prisma ?? (global.__prisma = new PrismaClient());

class PrismaDB implements Database {
  async createTrip(trip: TripWithDetails): Promise<TripWithDetails> {
    const created = await prisma.trip.create({
      data: {
        id: trip.id,
        template_id: trip.template_id,
        user_id: trip.user_id,
        title: trip.title,
        start_date: trip.start_date,
        people_count: trip.people_count,
        note: trip.note,
        created_at: trip.created_at,
        updated_at: trip.updated_at,
        days: {
          create: trip.days.map((day) => ({
            id: day.id,
            day_index: day.day_index,
            label: day.label,
            city: day.city,
            is_ski_day: day.is_ski_day,
            items: {
              create: day.items.map((item) => ({
                id: item.id,
                type: item.type,
                title: item.title,
                date: item.date,
                time: item.time,
                time_hint: item.time_hint,
                location: item.location,
                link: item.link,
                note: item.note,
                created_at: item.created_at,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            items: true,
          },
          orderBy: {
            day_index: 'asc',
          },
        },
      },
    });

    return created as TripWithDetails;
  }

  async getTripById(id: string): Promise<TripWithDetails | null> {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        days: {
          include: {
            items: true,
          },
          orderBy: {
            day_index: 'asc',
          },
        },
      },
    });

    return trip as TripWithDetails | null;
  }

  async getAllTrips(userId: string): Promise<TripWithDetails[]> {
    const trips = await prisma.trip.findMany({
      where: { user_id: userId },
      include: {
        days: {
          include: {
            items: true,
          },
          orderBy: {
            day_index: 'asc',
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return trips as TripWithDetails[];
  }

  async updateTrip(id: string, data: Partial<TripWithDetails>): Promise<TripWithDetails> {
    // Linus 原則：简单处理 - 只更新 Trip 字段，不更新嵌套结构
    // Days/Items 有独立的 update endpoints
    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title: data.title,
        start_date: data.start_date,
        people_count: data.people_count,
        note: data.note,
        updated_at: new Date(),
      },
      include: {
        days: {
          include: {
            items: {
              orderBy: { created_at: 'asc' },
            },
          },
          orderBy: {
            day_index: 'asc',
          },
        },
      },
    });

    return updated as TripWithDetails;
  }

  async deleteTrip(id: string): Promise<void> {
    await prisma.trip.delete({
      where: { id },
    });
  }

  // ==================== Checklist Operations ====================

  async createChecklistItems(items: ChecklistItem[]): Promise<ChecklistItem[]> {
    const created = await prisma.$transaction(
      items.map((item) =>
        prisma.checklistItem.create({
          data: {
            id: item.id,
            trip_id: item.trip_id,
            category: item.category,
            title: item.title,
            completed: item.completed,
            order: item.order,
            created_at: item.created_at,
          },
        })
      )
    );

    return created as ChecklistItem[];
  }

  async getChecklistByTripId(tripId: string): Promise<ChecklistItem[]> {
    const items = await prisma.checklistItem.findMany({
      where: { trip_id: tripId },
      orderBy: { order: 'asc' },
    });

    return items as ChecklistItem[];
  }

  async updateChecklistItem(id: string, item: ChecklistItem): Promise<ChecklistItem> {
    const updated = await prisma.checklistItem.update({
      where: { id },
      data: {
        completed: item.completed,
      },
    });

    return updated as ChecklistItem;
  }

  async deleteChecklistItem(id: string): Promise<void> {
    await prisma.checklistItem.delete({ where: { id } });
  }

  // ==================== Packing Operations ====================

  async createPackingItems(items: PackingItem[]): Promise<PackingItem[]> {
    const created = await prisma.$transaction(
      items.map((item) =>
        prisma.packingItem.create({
          data: {
            id: item.id,
            trip_id: item.trip_id,
            category: item.category,
            title: item.title,
            completed: item.completed,
            order: item.order,
            created_at: item.created_at,
          },
        })
      )
    );

    return created as PackingItem[];
  }

  async getPackingByTripId(tripId: string): Promise<PackingItem[]> {
    const items = await prisma.packingItem.findMany({
      where: { trip_id: tripId },
      orderBy: { order: 'asc' },
    });

    return items as PackingItem[];
  }

  async updatePackingItem(id: string, item: PackingItem): Promise<PackingItem> {
    const updated = await prisma.packingItem.update({
      where: { id },
      data: {
        completed: item.completed,
      },
    });

    return updated as PackingItem;
  }

  async deletePackingItem(id: string): Promise<void> {
    await prisma.packingItem.delete({ where: { id } });
  }
}

export const prismaDB = new PrismaDB();
