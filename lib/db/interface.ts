/**
 * 数据库接口抽象
 *
 * Linus 原则：定义清晰的接口，实现可替换
 */

import {
  TripWithDetails,
  ChecklistItem,
  PackingItem,
} from '@/lib/types/template';

export interface Database {
  // Trip operations
  createTrip(trip: TripWithDetails): Promise<TripWithDetails>;
  getTripById(id: string): Promise<TripWithDetails | null>;
  getAllTrips(userId: string): Promise<TripWithDetails[]>;
  updateTrip(id: string, trip: TripWithDetails): Promise<TripWithDetails>;
  deleteTrip(id: string): Promise<void>;

  // Checklist operations
  createChecklistItems(items: ChecklistItem[]): Promise<ChecklistItem[]>;
  getChecklistByTripId(tripId: string): Promise<ChecklistItem[]>;
  updateChecklistItem(id: string, item: ChecklistItem): Promise<ChecklistItem>;
  deleteChecklistItem(id: string): Promise<void>;

  // Packing operations
  createPackingItems(items: PackingItem[]): Promise<PackingItem[]>;
  getPackingByTripId(tripId: string): Promise<PackingItem[]>;
  updatePackingItem(id: string, item: PackingItem): Promise<PackingItem>;
  deletePackingItem(id: string): Promise<void>;
}
