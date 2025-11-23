/**
 * 数据库接口抽象
 *
 * Linus 原则：定义清晰的接口，实现可替换
 * 
 * 重構：添加直接的 Item/Day 操作，消除 O(n³) 遍歷
 */

import {
  TripWithDetails,
  TripData,
  DayData,
  ItemData,
  ChecklistItem,
  PackingItem,
} from '@/lib/types/template';

export interface Database {
  // Trip operations
  createTrip(trip: TripWithDetails): Promise<TripWithDetails>;
  getTripById(id: string): Promise<TripWithDetails | null>;
  getAllTrips(): Promise<TripWithDetails[]>;
  updateTrip(id: string, data: Partial<TripData>): Promise<TripWithDetails>;
  deleteTrip(id: string): Promise<void>;

  // Day operations - NEW! 直接操作 Day，不通過 Trip
  createDay(tripId: string, data: Omit<DayData, 'id' | 'trip_id'>): Promise<DayData>;
  updateDay(id: string, data: Partial<DayData>): Promise<DayData>;
  deleteDay(id: string): Promise<void>;
  getDayById(id: string): Promise<DayData | null>;

  // Item operations - NEW! 直接操作 Item，O(1) 複雜度
  createItem(dayId: string, data: Omit<ItemData, 'id' | 'day_id' | 'created_at'>): Promise<ItemData>;
  updateItem(id: string, data: Partial<ItemData>): Promise<ItemData>;
  deleteItem(id: string): Promise<void>;
  getItemById(id: string): Promise<ItemData | null>;

  // Checklist operations
  createChecklistItems(items: ChecklistItem[]): Promise<ChecklistItem[]>;
  getChecklistByTripId(tripId: string): Promise<ChecklistItem[]>;
  getChecklistItemById(id: string): Promise<ChecklistItem | null>; // NEW: O(1) 查詢
  updateChecklistItem(id: string, item: ChecklistItem): Promise<ChecklistItem>;
  deleteChecklistItem(id: string): Promise<void>;

  // Packing operations
  createPackingItems(items: PackingItem[]): Promise<PackingItem[]>;
  getPackingByTripId(tripId: string): Promise<PackingItem[]>;
  getPackingItemById(id: string): Promise<PackingItem | null>; // NEW: O(1) 查詢
  updatePackingItem(id: string, item: PackingItem): Promise<PackingItem>;
  deletePackingItem(id: string): Promise<void>;
}
