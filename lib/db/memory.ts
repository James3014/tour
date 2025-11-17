/**
 * In-Memory 資料庫（MVP 快速版）
 *
 * Linus: "Do the simplest thing that could work"
 *
 * 修复：使用 global 变量防止 Next.js 热重载导致的内存泄漏
 */

import { TripWithDetails } from '@/lib/types/template';
import { Database } from './interface';

class MemoryDB implements Database {
  private trips: Map<string, TripWithDetails> = new Map();

  async createTrip(trip: TripWithDetails): Promise<TripWithDetails> {
    this.trips.set(trip.id, trip);
    return trip;
  }

  async getTripById(id: string): Promise<TripWithDetails | null> {
    return this.trips.get(id) || null;
  }

  async getAllTrips(userId: string): Promise<TripWithDetails[]> {
    return Array.from(this.trips.values()).filter((t) => t.user_id === userId);
  }

  async updateTrip(id: string, trip: TripWithDetails): Promise<TripWithDetails> {
    this.trips.set(id, trip);
    return trip;
  }

  async deleteTrip(id: string): Promise<void> {
    this.trips.delete(id);
  }
}

/**
 * 防止 Next.js 开发模式热重载时创建多个实例
 * 使用 global 变量保持单例
 */
declare global {
  var __memoryDB: MemoryDB | undefined;
}

export const db = global.__memoryDB ?? (global.__memoryDB = new MemoryDB());
