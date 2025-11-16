/**
 * In-Memory 資料庫（MVP 快速版）
 *
 * Linus: "Do the simplest thing that could work"
 * 部署時再切換到真正的 PostgreSQL
 */

import { TripWithDetails } from '@/lib/types/template';

class MemoryDB {
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

export const db = new MemoryDB();
