/**
 * 模板系統類型定義
 *
 * 設計原則（Linus 風格）：
 * 1. 簡單：只有 Template/DayTemplate/ItemTemplate 三層
 * 2. 清晰：數據所有權明確
 * 3. 零特殊情況：所有字段都有明確用途
 */

export type TimeHint = 'morning' | 'afternoon' | 'evening' | 'full_day';

export type ItemType =
  | 'flight'     // 航班
  | 'hotel'      // 住宿
  | 'transfer'   // 交通
  | 'ski'        // 滑雪
  | 'lesson'     // 課程
  | 'todo'       // 待辦
  | 'note'       // 備註
  | 'other';     // 其他

/**
 * Item 模板：單個事件的預設值
 */
export interface ItemTemplate {
  type: ItemType;
  title_default: string;
  time_hint?: TimeHint;
  location_hint?: string;
  note_default?: string;
}

/**
 * Day 模板：某天的骨架
 */
export interface DayTemplate {
  day_index: number;
  label: string;
  default_city?: string;
  is_ski_day: boolean;
  item_templates: ItemTemplate[];
}

/**
 * Template 模板：整個旅程的骨架
 */
export interface Template {
  template_id: string;
  name: string;
  region: string;
  default_days: number;
  default_ski_days: number;
  target_group: string;
  description: string;
  day_templates: DayTemplate[];
}

/**
 * 從模板創建 Trip 的輸入
 */
export interface CreateTripFromTemplateInput {
  template_id: string;
  user_id: string;
  title?: string; // 可選：用戶自定義標題
}

/**
 * Trip 資料（對應 Prisma model）
 */
export interface TripData {
  id: string;
  template_id: string;
  user_id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Day 資料（對應 Prisma model）
 */
export interface DayData {
  id: string;
  trip_id: string;
  day_index: number;
  label: string;
  city: string | null;
  is_ski_day: boolean;
}

/**
 * Item 資料（對應 Prisma model）
 */
export interface ItemData {
  id: string;
  day_id: string;
  type: ItemType;
  title: string;
  time_hint: TimeHint | null;
  location: string | null;
  note: string | null;
  created_at: Date;
}

/**
 * 完整的 Trip（包含 Days 和 Items）
 */
export interface TripWithDetails extends TripData {
  days: (DayData & {
    items: ItemData[];
  })[];
}
