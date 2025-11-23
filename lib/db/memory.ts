/**
 * In-Memory 資料庫（重構版）
 *
 * Linus: "Do the simplest thing that could work"
 * 
 * 重構：使用獨立的 Map 存儲 Day 和 Item，實現 O(1) 查詢
 * 修复：使用 global 变量防止 Next.js 热重载导致的内存泄漏
 */

import {
  TripWithDetails,
  TripData,
  DayData,
  ItemData,
  ChecklistItem,
  PackingItem,
} from '@/lib/types/template';
import { Database } from './interface';

class MemoryDB implements Database {
  private trips: Map<string, TripWithDetails> = new Map();
  private days: Map<string, DayData> = new Map();           // NEW! 獨立存儲 Day
  private items: Map<string, ItemData> = new Map();         // NEW! 獨立存儲 Item
  private checklists: Map<string, ChecklistItem> = new Map();
  private packings: Map<string, PackingItem> = new Map();

  // Item operations - NEW! O(1) 直接操作
  async createItem(dayId: string, data: Omit<ItemData, 'id' | 'day_id' | 'created_at'>): Promise<ItemData> {
    // 驗證 parent Day 存在
    if (!this.days.has(dayId)) {
      throw new Error('Day not found');
    }

    const item: ItemData = {
      id: crypto.randomUUID(),
      day_id: dayId,
      created_at: new Date(),
      ...data,
    };

    this.items.set(item.id, item);
    return item;
  }

  async updateItem(id: string, data: Partial<ItemData>): Promise<ItemData> {
    const existing = this.items.get(id);
    if (!existing) {
      throw new Error('Item not found');
    }

    const updated = { ...existing, ...data };
    this.items.set(id, updated);
    return updated;
  }

  async deleteItem(id: string): Promise<void> {
    if (!this.items.has(id)) {
      throw new Error('Item not found');
    }
    this.items.delete(id);
  }

  async getItemById(id: string): Promise<ItemData | null> {
    return this.items.get(id) || null;
  }

  // Day operations - NEW! 直接操作 Day
  async createDay(tripId: string, data: Omit<DayData, 'id' | 'trip_id'>): Promise<DayData> {
    // 驗證 parent Trip 存在
    if (!this.trips.has(tripId)) {
      throw new Error('Trip not found');
    }

    const day: DayData = {
      id: crypto.randomUUID(),
      trip_id: tripId,
      ...data,
    };

    this.days.set(day.id, day);
    return day;
  }

  async updateDay(id: string, data: Partial<DayData>): Promise<DayData> {
    const existing = this.days.get(id);
    if (!existing) {
      throw new Error('Day not found');
    }

    const updated = { ...existing, ...data };
    this.days.set(id, updated);
    return updated;
  }

  async deleteDay(id: string): Promise<void> {
    const day = this.days.get(id);
    if (!day) {
      throw new Error('Day not found');
    }

    // Cascade delete: 刪除所有 Items
    for (const [itemId, item] of this.items.entries()) {
      if (item.day_id === id) {
        this.items.delete(itemId);
      }
    }

    // 刪除 Day
    this.days.delete(id);

    // 重新排序 day_index
    const remainingDays = Array.from(this.days.values())
      .filter(d => d.trip_id === day.trip_id)
      .sort((a, b) => a.day_index - b.day_index);

    remainingDays.forEach((d, index) => {
      d.day_index = index + 1;
      this.days.set(d.id, d);
    });
  }

  async getDayById(id: string): Promise<DayData | null> {
    return this.days.get(id) || null;
  }

  // Trip operations
  async createTrip(trip: TripWithDetails): Promise<TripWithDetails> {
    // 存儲 Trip 基本信息
    this.trips.set(trip.id, trip);

    // 同時填充 days 和 items Map
    for (const day of trip.days) {
      this.days.set(day.id, {
        id: day.id,
        trip_id: trip.id,
        day_index: day.day_index,
        label: day.label,
        city: day.city,
        is_ski_day: day.is_ski_day,
      });

      for (const item of day.items) {
        this.items.set(item.id, item);
      }
    }

    return trip;
  }

  async getTripById(id: string): Promise<TripWithDetails | null> {
    const trip = this.trips.get(id);
    if (!trip) return null;

    // 從 days Map 獲取
    const days = Array.from(this.days.values())
      .filter(d => d.trip_id === id)
      .sort((a, b) => a.day_index - b.day_index);

    // 從 items Map 獲取並組裝
    const daysWithItems = days.map(day => ({
      ...day,
      items: Array.from(this.items.values())
        .filter(i => i.day_id === day.id)
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    }));

    return {
      ...trip,
      days: daysWithItems,
    };
  }

  async getAllTrips(options?: { limit?: number; offset?: number }): Promise<TripWithDetails[]> {
    let trips = Array.from(this.trips.values());
    
    // 分頁
    if (options?.offset) {
      trips = trips.slice(options.offset);
    }
    if (options?.limit) {
      trips = trips.slice(0, options.limit);
    }
    
    // 為每個 Trip 組裝完整結構
    return Promise.all(trips.map(trip => this.getTripById(trip.id) as Promise<TripWithDetails>));
  }

  async updateTrip(id: string, data: Partial<TripData>): Promise<TripWithDetails> {
    const existing = this.trips.get(id);
    if (!existing) throw new Error('Trip not found');

    // 只更新 Trip 層級的字段，不更新 days
    const updated = { ...existing, ...data };
    this.trips.set(id, updated);
    
    // 返回完整結構
    return this.getTripById(id) as Promise<TripWithDetails>;
  }

  async deleteTrip(id: string): Promise<void> {
    if (!this.trips.has(id)) {
      throw new Error('Trip not found');
    }

    // Cascade delete: 刪除所有 Days
    const daysToDelete = Array.from(this.days.values()).filter(d => d.trip_id === id);
    for (const day of daysToDelete) {
      // 刪除 Day 的所有 Items
      for (const [itemId, item] of this.items.entries()) {
        if (item.day_id === day.id) {
          this.items.delete(itemId);
        }
      }
      this.days.delete(day.id);
    }

    // 刪除所有 Checklist 和 Packing
    for (const [checklistId, item] of this.checklists.entries()) {
      if (item.trip_id === id) {
        this.checklists.delete(checklistId);
      }
    }
    for (const [packingId, item] of this.packings.entries()) {
      if (item.trip_id === id) {
        this.packings.delete(packingId);
      }
    }

    // 刪除 Trip
    this.trips.delete(id);
  }

  // Checklist operations
  async createChecklistItems(items: ChecklistItem[]): Promise<ChecklistItem[]> {
    items.forEach((item) => {
      this.checklists.set(item.id, item);
    });
    return items;
  }

  async getChecklistByTripId(tripId: string): Promise<ChecklistItem[]> {
    return Array.from(this.checklists.values())
      .filter((item) => item.trip_id === tripId)
      .sort((a, b) => a.order - b.order);
  }

  async getChecklistItemById(id: string): Promise<ChecklistItem | null> {
    return this.checklists.get(id) || null;
  }

  async updateChecklistItem(id: string, item: ChecklistItem): Promise<ChecklistItem> {
    this.checklists.set(id, item);
    return item;
  }

  async deleteChecklistItem(id: string): Promise<void> {
    this.checklists.delete(id);
  }

  // Packing operations
  async createPackingItems(items: PackingItem[]): Promise<PackingItem[]> {
    items.forEach((item) => {
      this.packings.set(item.id, item);
    });
    return items;
  }

  async getPackingByTripId(tripId: string): Promise<PackingItem[]> {
    return Array.from(this.packings.values())
      .filter((item) => item.trip_id === tripId)
      .sort((a, b) => a.order - b.order);
  }

  async getPackingItemById(id: string): Promise<PackingItem | null> {
    return this.packings.get(id) || null;
  }

  async updatePackingItem(id: string, item: PackingItem): Promise<PackingItem> {
    this.packings.set(id, item);
    return item;
  }

  async deletePackingItem(id: string): Promise<void> {
    this.packings.delete(id);
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
