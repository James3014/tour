/**
 * Zod Schema Tests - 日期處理驗證
 *
 * 測試 CreateTripSchema 的 start_date 欄位正確處理各種輸入
 */

import { CreateTripSchema } from '../schemas';

describe('CreateTripSchema', () => {
  const validBaseInput = {
    template_id: 'test-template',
    user_id: 'test-user',
    title: 'Test Trip',
    days: 6,
  };

  describe('start_date 日期處理', () => {
    it('should parse valid YYYY-MM-DD string to Date', () => {
      const input = {
        ...validBaseInput,
        start_date: '2025-12-28',
      };

      const result = CreateTripSchema.parse(input);

      expect(result.start_date).toBeInstanceOf(Date);
      expect(result.start_date?.toISOString()).toContain('2025-12-28');
    });

    it('should handle null as null (not epoch date)', () => {
      const input = {
        ...validBaseInput,
        start_date: null,
      };

      const result = CreateTripSchema.parse(input);

      // 關鍵測試：null 應該保持為 null，而不是被轉換為 Unix epoch
      expect(result.start_date).toBeNull();
    });

    it('should handle empty string as null', () => {
      const input = {
        ...validBaseInput,
        start_date: '',
      };

      const result = CreateTripSchema.parse(input);

      // 空字串應該被轉換為 null
      expect(result.start_date).toBeNull();
    });

    it('should handle undefined as undefined (optional field)', () => {
      const input = {
        ...validBaseInput,
        // start_date 未提供
      };

      const result = CreateTripSchema.parse(input);

      expect(result.start_date).toBeUndefined();
    });

    it('should parse ISO date string correctly', () => {
      const input = {
        ...validBaseInput,
        start_date: '2025-12-28T00:00:00.000Z',
      };

      const result = CreateTripSchema.parse(input);

      expect(result.start_date).toBeInstanceOf(Date);
      expect(result.start_date?.toISOString()).toBe('2025-12-28T00:00:00.000Z');
    });

    it('should handle cross-year date correctly', () => {
      const input = {
        ...validBaseInput,
        start_date: '2025-12-31',
      };

      const result = CreateTripSchema.parse(input);

      expect(result.start_date).toBeInstanceOf(Date);
      // 確保跨年邊界正確處理
      expect(result.start_date?.getUTCFullYear()).toBe(2025);
      expect(result.start_date?.getUTCMonth()).toBe(11); // December is month 11
      expect(result.start_date?.getUTCDate()).toBe(31);
    });

    it('should reject invalid date format', () => {
      const input = {
        ...validBaseInput,
        start_date: 'not-a-date',
      };

      // 無效日期應該拋出錯誤
      expect(() => CreateTripSchema.parse(input)).toThrow();
    });
  });

  describe('其他欄位驗證', () => {
    it('should accept valid complete input', () => {
      const input = {
        ...validBaseInput,
        start_date: '2025-12-28',
        people_count: 4,
        note: '家庭旅遊',
      };

      const result = CreateTripSchema.parse(input);

      expect(result.template_id).toBe('test-template');
      expect(result.user_id).toBe('test-user');
      expect(result.title).toBe('Test Trip');
      expect(result.days).toBe(6);
      expect(result.people_count).toBe(4);
      expect(result.note).toBe('家庭旅遊');
    });

    it('should reject empty template_id', () => {
      const input = {
        ...validBaseInput,
        template_id: '',
      };

      expect(() => CreateTripSchema.parse(input)).toThrow('模板 ID 不能为空');
    });

    it('should reject empty user_id', () => {
      const input = {
        ...validBaseInput,
        user_id: '',
      };

      expect(() => CreateTripSchema.parse(input)).toThrow('用户 ID 不能为空');
    });
  });
});

// 模擬完整 API 流程的整合測試
describe('API Route Integration', () => {
  it('should preserve date through entire POST flow', () => {
    const input = {
      template_id: 'jp_hokkaido_6d3s1c_v1',
      user_id: 'test_user',
      title: '測試日期保存',
      start_date: '2025-12-28',
      days: 6,
      people_count: 4,
    };

    // Step 1: Zod validation (same as API route)
    const validatedData = CreateTripSchema.parse(input);
    
    // Step 2: API route transformation (line 24 in route.ts)
    const start_date = validatedData.start_date 
      ? new Date(validatedData.start_date) 
      : null;
    
    // Step 3: Service layer (line 61 in trip.ts)
    const finalDate = start_date ?? null;

    // Verify each step
    expect(validatedData.start_date).toBeInstanceOf(Date);
    expect(start_date).toBeInstanceOf(Date);
    expect(finalDate).toBeInstanceOf(Date);
    expect(finalDate?.toISOString()).toContain('2025-12-28');
  });
});
