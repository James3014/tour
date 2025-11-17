/**
 * Packing Service Tests
 *
 * TDD Red Phase: 測試先行
 */

import { togglePackingItem } from '../checklist';
import { PackingItem } from '@/lib/types/template';

describe('togglePackingItem', () => {
  describe('基本功能', () => {
    it('應該將 completed=false 的項目切換為 true', () => {
      const item: PackingItem = {
        id: 'item-1',
        trip_id: 'trip-123',
        category: 'clothing',
        title: '滑雪外套',
        completed: false,
        order: 1,
        created_at: new Date('2025-01-01'),
      };

      const result = togglePackingItem(item);

      expect(result.id).toBe('item-1');
      expect(result.title).toBe('滑雪外套');
      expect(result.completed).toBe(true);
    });

    it('應該將 completed=true 的項目切換為 false', () => {
      const item: PackingItem = {
        id: 'item-2',
        trip_id: 'trip-123',
        category: 'equipment',
        title: '雪具',
        completed: true,
        order: 2,
        created_at: new Date('2025-01-01'),
      };

      const result = togglePackingItem(item);

      expect(result.id).toBe('item-2');
      expect(result.title).toBe('雪具');
      expect(result.completed).toBe(false);
    });
  });

  describe('資料完整性', () => {
    it('應該返回新物件而非修改原物件', () => {
      const item: PackingItem = {
        id: 'item-3',
        trip_id: 'trip-123',
        category: 'accessories',
        title: '太陽眼鏡',
        completed: false,
        order: 3,
        created_at: new Date('2025-01-01'),
      };

      const result = togglePackingItem(item);

      // 確保原物件未被修改
      expect(item.completed).toBe(false);
      // 確保返回的是新物件
      expect(result).not.toBe(item);
      // 確保新物件的 completed 已切換
      expect(result.completed).toBe(true);
    });

    it('應該保留所有其他欄位不變', () => {
      const item: PackingItem = {
        id: 'item-4',
        trip_id: 'trip-123',
        category: 'electronics',
        title: '手機充電器',
        completed: false,
        order: 4,
        created_at: new Date('2025-01-01'),
      };

      const result = togglePackingItem(item);

      expect(result.id).toBe(item.id);
      expect(result.title).toBe(item.title);
      expect(result.trip_id).toBe(item.trip_id);
      expect(result.category).toBe(item.category);
      expect(result.order).toBe(item.order);
      expect(result.created_at).toBe(item.created_at);
      // 只有 completed 改變
      expect(result.completed).toBe(!item.completed);
    });
  });

  describe('邊界情況', () => {
    it('應該處理空標題', () => {
      const item: PackingItem = {
        id: 'item-5',
        trip_id: 'trip-123',
        category: 'other',
        title: '',
        completed: false,
        order: 5,
        created_at: new Date('2025-01-01'),
      };

      const result = togglePackingItem(item);

      expect(result.title).toBe('');
      expect(result.completed).toBe(true);
    });

    it('應該多次切換正確', () => {
      let item: PackingItem = {
        id: 'item-6',
        trip_id: 'trip-123',
        category: 'toiletries',
        title: '防曬乳',
        completed: false,
        order: 6,
        created_at: new Date('2025-01-01'),
      };

      // 第一次切換
      item = togglePackingItem(item);
      expect(item.completed).toBe(true);

      // 第二次切換
      item = togglePackingItem(item);
      expect(item.completed).toBe(false);

      // 第三次切換
      item = togglePackingItem(item);
      expect(item.completed).toBe(true);
    });
  });
});
