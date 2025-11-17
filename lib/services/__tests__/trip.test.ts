/**
 * TDD: 測試從模板生成 Trip 的核心邏輯
 *
 * Linus 原則：
 * 1. 測試數據結構，不是花哨功能
 * 2. 消除特殊情況
 * 3. 簡單清晰
 */

import { createTripFromTemplate } from '../trip';
import { getTemplateById } from '@/lib/templates';

describe('createTripFromTemplate', () => {
  describe('基本功能', () => {
    it('應該從北海道模板創建 6 天的 Trip', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);

      expect(result.template_id).toBe('jp_hokkaido_6d3s1c_v1');
      expect(result.user_id).toBe('test_user_123');
      expect(result.title).toBe('北海道 6 日・3 天滑雪 + 1 天市區');
      expect(result.days).toHaveLength(6);
    });

    it('應該從韓國模板創建 4 天的 Trip', () => {
      const input = {
        template_id: 'kr_yongpyong_4d2s_v1',
        user_id: 'test_user_456',
      };

      const result = createTripFromTemplate(input);

      expect(result.template_id).toBe('kr_yongpyong_4d2s_v1');
      expect(result.days).toHaveLength(4);
    });

    it('應該允許自定義標題', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
        title: '我的北海道滑雪之旅',
      };

      const result = createTripFromTemplate(input);

      expect(result.title).toBe('我的北海道滑雪之旅');
    });
  });

  describe('Day 生成', () => {
    it('應該正確生成每天的 label', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);

      expect(result.days[0].label).toBe('出發＆抵達北海道');
      expect(result.days[1].label).toBe('滑雪日 1');
      expect(result.days[4].label).toBe('札幌市區＆購物');
    });

    it('應該正確設置 is_ski_day', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);

      // Day 1: 不是滑雪日
      expect(result.days[0].is_ski_day).toBe(false);
      // Day 2, 3, 4: 滑雪日
      expect(result.days[1].is_ski_day).toBe(true);
      expect(result.days[2].is_ski_day).toBe(true);
      expect(result.days[3].is_ski_day).toBe(true);
      // Day 5, 6: 不是滑雪日
      expect(result.days[4].is_ski_day).toBe(false);
      expect(result.days[5].is_ski_day).toBe(false);
    });

    it('應該正確設置 day_index（從 1 開始）', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);

      result.days.forEach((day, index) => {
        expect(day.day_index).toBe(index + 1);
      });
    });
  });

  describe('Item 生成', () => {
    it('應該為 Day 1 生成 4 個 items', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);
      const day1 = result.days[0];

      expect(day1.items).toHaveLength(4);
      expect(day1.items[0].type).toBe('flight');
      expect(day1.items[0].title).toBe('去程航班');
      expect(day1.items[1].type).toBe('transfer');
      expect(day1.items[2].type).toBe('hotel');
      expect(day1.items[3].type).toBe('note');
    });

    it('應該正確複製 note_default 到 note', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);
      const day1Items = result.days[0].items;

      const flightItem = day1Items[0];
      expect(flightItem.note).toContain('請填寫航空公司');
    });

    it('應該正確設置 time_hint', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);
      const day1Items = result.days[0].items;

      expect(day1Items[0].time_hint).toBe('morning');     // flight
      expect(day1Items[1].time_hint).toBe('afternoon');   // transfer
      expect(day1Items[2].time_hint).toBe('evening');     // hotel
    });
  });

  describe('錯誤處理', () => {
    it('應該在找不到模板時拋出錯誤', () => {
      const input = {
        template_id: 'non_existent_template',
        user_id: 'test_user_123',
      };

      expect(() => createTripFromTemplate(input)).toThrow('找不到模板');
    });
  });

  describe('數據完整性', () => {
    it('應該為所有 items 生成唯一 ID', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);

      const allItemIds = result.days.flatMap((day) => day.items.map((item) => item.id));
      const uniqueIds = new Set(allItemIds);

      expect(uniqueIds.size).toBe(allItemIds.length);
    });

    it('應該為所有 days 生成唯一 ID', () => {
      const input = {
        template_id: 'jp_hokkaido_6d3s1c_v1',
        user_id: 'test_user_123',
      };

      const result = createTripFromTemplate(input);

      const dayIds = result.days.map((day) => day.id);
      const uniqueIds = new Set(dayIds);

      expect(uniqueIds.size).toBe(dayIds.length);
    });
  });
});
