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
import { TripWithDetails } from '@/lib/types/template';

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
                time_hint: item.time_hint,
                location: item.location,
                note: item.note,
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

  async updateTrip(id: string, trip: TripWithDetails): Promise<TripWithDetails> {
    // 先删除旧的 days 和 items（cascade delete）
    await prisma.day.deleteMany({
      where: { trip_id: id },
    });

    // 更新 trip 并创建新的 days 和 items
    const updated = await prisma.trip.update({
      where: { id },
      data: {
        title: trip.title,
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
                time_hint: item.time_hint,
                location: item.location,
                note: item.note,
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

    return updated as TripWithDetails;
  }

  async deleteTrip(id: string): Promise<void> {
    await prisma.trip.delete({
      where: { id },
    });
  }
}

export const prismaDB = new PrismaDB();
