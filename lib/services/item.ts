/**
 * Item 核心邏輯
 *
 * Linus 原則：
 * 1. 簡單：只處理 Item 的創建和驗證
 * 2. 數據結構優先：返回完整的 ItemData
 * 3. 無特殊情況：統一處理所有 Item 類型
 */

import { ItemData, ItemType, TimeHint } from '@/lib/types/template';

/**
 * 創建 Item 的輸入參數
 */
export interface CreateItemInput {
  day_id: string;
  type: ItemType;
  title: string;
  date?: Date | null;
  time?: string | null;
  time_hint?: TimeHint | null;
  location?: string | null;
  link?: string | null;
  note?: string | null;
}

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 在指定 Day 中創建新的 Item
 *
 * @param input - Item 創建參數
 * @returns 新創建的 ItemData
 * @throws {Error} 當 day_id 或 title 為空時拋出錯誤
 */
export function createItemInDay(input: CreateItemInput): ItemData {
  // 驗證必填欄位
  if (!input.day_id || input.day_id.trim() === '') {
    throw new Error('Day ID 不能為空');
  }

  if (!input.title || input.title.trim() === '') {
    throw new Error('標題不能為空');
  }

  // 創建 Item
  const item: ItemData = {
    id: generateId(),
    day_id: input.day_id,
    type: input.type,
    title: input.title,
    date: input.date ?? null,
    time: input.time ?? null,
    time_hint: input.time_hint ?? null,
    location: input.location ?? null,
    link: input.link ?? null,
    note: input.note ?? null,
    created_at: new Date(),
  };

  return item;
}
