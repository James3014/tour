/**
 * Item 操作測試
 *
 * TDD 原則：先寫測試，後寫實現
 */

import { createItemInDay } from '../item';
import { ItemType, TimeHint } from '@/lib/types/template';

describe('createItemInDay', () => {
  describe('基本功能', () => {
    it('應該創建一個新的 Item', () => {
      const input = {
        day_id: 'test-day-123',
        type: 'flight' as ItemType,
        title: '去程航班',
      };

      const result = createItemInDay(input);

      expect(result.id).toBeDefined();
      expect(result.day_id).toBe('test-day-123');
      expect(result.type).toBe('flight');
      expect(result.title).toBe('去程航班');
      expect(result.created_at).toBeInstanceOf(Date);
    });

    it('應該生成唯一的 ID', () => {
      const input = {
        day_id: 'test-day-123',
        type: 'hotel' as ItemType,
        title: '住宿',
      };

      const item1 = createItemInDay(input);
      const item2 = createItemInDay(input);

      expect(item1.id).not.toBe(item2.id);
    });

    it('應該正確設置所有可選欄位', () => {
      const input = {
        day_id: 'test-day-123',
        type: 'flight' as ItemType,
        title: '去程航班 CI102',
        time: '08:30',
        time_hint: 'morning' as TimeHint,
        location: '桃園機場第二航廈',
        link: 'https://example.com/booking',
        note: '記得提前 2 小時到',
      };

      const result = createItemInDay(input);

      expect(result.time).toBe('08:30');
      expect(result.time_hint).toBe('morning');
      expect(result.location).toBe('桃園機場第二航廈');
      expect(result.link).toBe('https://example.com/booking');
      expect(result.note).toBe('記得提前 2 小時到');
    });
  });

  describe('欄位初始化', () => {
    it('應該將未提供的可選欄位初始化為 null', () => {
      const input = {
        day_id: 'test-day-123',
        type: 'ski' as ItemType,
        title: '滑雪',
      };

      const result = createItemInDay(input);

      expect(result.date).toBeNull();
      expect(result.time).toBeNull();
      expect(result.time_hint).toBeNull();
      expect(result.location).toBeNull();
      expect(result.link).toBeNull();
      expect(result.note).toBeNull();
    });
  });

  describe('錯誤處理', () => {
    it('應該在標題為空時拋出錯誤', () => {
      const input = {
        day_id: 'test-day-123',
        type: 'flight' as ItemType,
        title: '',
      };

      expect(() => createItemInDay(input)).toThrow('標題不能為空');
    });

    it('應該在 day_id 為空時拋出錯誤', () => {
      const input = {
        day_id: '',
        type: 'flight' as ItemType,
        title: '去程航班',
      };

      expect(() => createItemInDay(input)).toThrow('Day ID 不能為空');
    });
  });
});
