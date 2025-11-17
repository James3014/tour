/**
 * 数据库接口抽象
 *
 * Linus 原则：定义清晰的接口，实现可替换
 */

import { TripWithDetails } from '@/lib/types/template';

export interface Database {
  createTrip(trip: TripWithDetails): Promise<TripWithDetails>;
  getTripById(id: string): Promise<TripWithDetails | null>;
  getAllTrips(userId: string): Promise<TripWithDetails[]>;
  updateTrip(id: string, trip: TripWithDetails): Promise<TripWithDetails>;
  deleteTrip(id: string): Promise<void>;
}
