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
  TripData,
  DayData,
  ItemData,
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
  // ==================== Item Operations ====================

  async createItem(dayId: string, data: Omit<ItemData, 'id' | 'day_id' | 'created_at'>): Promise<ItemData> {
    try {
      const item = await prisma.item.create({
        data: {
          day_id: dayId,
          type: data.type,
          title: data.title,
          date: data.date,
          time: data.time,
          time_hint: data.time_hint,
          location: data.location,
          link: data.link,
          note: data.note,
        },
      });
      return item as ItemData;
    } catch (error: any) {
      // Prisma P2003: Foreign key constraint failed (Day 不存在)
      if (error.code === 'P2003') {
        throw new Error('Day not found');
      }
      throw error;
    }
  }

  async updateItem(id: string, data: Partial<ItemData>): Promise<ItemData> {
    try {
      const item = await prisma.item.update({
        where: { id },
        data: {
          type: data.type,
          title: data.title,
          date: data.date,
          time: data.time,
          time_hint: data.time_hint,
          location: data.location,
          link: data.link,
          note: data.note,
        },
      });
      return item as ItemData;
    } catch (error: any) {
      // Prisma P2025: Record not found
      if (error.code === 'P2025') {
        throw new Error('Item not found');
      }
      throw error;
    }
  }

  async deleteItem(id: string): Promise<void> {
    try {
      await prisma.item.delete({ where: { id } });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Item not found');
      }
      throw error;
    }
  }

  async getItemById(id: string): Promise<ItemData | null> {
    const item = await prisma.item.findUnique({ where: { id } });
    return item as ItemData | null;
  }

  // ==================== Day Operations ====================

  async createDay(tripId: string, data: Omit<DayData, 'id' | 'trip_id'>): Promise<DayData> {
    try {
      const day = await prisma.day.create({
        data: {
          trip_id: tripId,
          day_index: data.day_index,
          label: data.label,
          city: data.city,
          is_ski_day: data.is_ski_day,
        },
      });
      return day as DayData;
    } catch (error: any) {
      if (error.code === 'P2003') {
        throw new Error('Trip not found');
      }
      throw error;
    }
  }

  async updateDay(id: string, data: Partial<DayData>): Promise<DayData> {
    try {
      const day = await prisma.day.update({
        where: { id },
        data: {
          day_index: data.day_index,
          label: data.label,
          city: data.city,
          is_ski_day: data.is_ski_day,
        },
      });
      return day as DayData;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Day not found');
      }
      throw error;
    }
  }

  async deleteDay(id: string): Promise<void> {
    try {
      // 獲取 Day 信息（用於重排）
      const day = await prisma.day.findUnique({ where: { id } });
      if (!day) {
        throw new Error('Day not found');
      }

      // 刪除 Day（cascade delete Items 由 Prisma schema 處理）
      await prisma.day.delete({ where: { id } });

      // 重新排序剩餘 Days 的 day_index
      const remainingDays = await prisma.day.findMany({
        where: { trip_id: day.trip_id },
        orderBy: { day_index: 'asc' },
      });

      // 批量更新 day_index
      await prisma.$transaction(
        remainingDays.map((d, index) =>
          prisma.day.update({
            where: { id: d.id },
            data: { day_index: index + 1 },
          })
        )
      );
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Day not found');
      }
      throw error;
    }
  }

  async getDayById(id: string): Promise<DayData | null> {
    const day = await prisma.day.findUnique({ where: { id } });
    return day as DayData | null;
  }

  // ==================== Trip Operations ====================

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

  async getAllTrips(): Promise<TripWithDetails[]> {
    const trips = await prisma.trip.findMany({
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

  async updateTrip(id: string, data: Partial<TripData>): Promise<TripWithDetails> {
    try {
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
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Trip not found');
      }
      throw error;
    }
  }

  async deleteTrip(id: string): Promise<void> {
    try {
      await prisma.trip.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error('Trip not found');
      }
      throw error;
    }
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

  async getChecklistItemById(id: string): Promise<ChecklistItem | null> {
    const item = await prisma.checklistItem.findUnique({
      where: { id },
    });

    return item as ChecklistItem | null;
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

  async getPackingItemById(id: string): Promise<PackingItem | null> {
    const item = await prisma.packingItem.findUnique({
      where: { id },
    });

    return item as PackingItem | null;
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
