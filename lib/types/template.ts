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
  resort_id?: string;
  suggested_resorts?: string[];
}

/**
 * Day 模板：某天的骨架
 */
export interface DayTemplate {
  day_index: number;
  label: string;
  default_city?: string;
  is_ski_day: boolean;
  default_resort_id?: string | null;
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
  title?: string;             // 可選：用戶自定義標題
  start_date?: Date | null;   // 出發日期
  days?: number;              // 旅程天數（若不同於模板預設）
  people_count?: number | null; // 預計同行人數
  note?: string | null;       // 簡短備註
}

/**
 * Trip 資料（對應 Prisma model）
 */
export interface TripData {
  id: string;
  template_id: string;
  user_id: string;
  title: string;
  start_date: Date | null;      // 旅程開始日期
  people_count: number | null;  // 預計同行人數
  note: string | null;          // 簡短備註
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
  resort_id: string | null;
  resort_name: string | null;
  region: string | null;
}

/**
 * Item 資料（對應 Prisma model）
 */
export interface ItemData {
  id: string;
  day_id: string;
  type: ItemType;
  title: string;
  date: Date | null;           // 具體日期
  time: string | null;         // 具體時間（如 "14:30"）
  time_hint: TimeHint | null;  // 時間提示（早上/下午/晚上）
  location: string | null;     // 地點
  link: string | null;         // 相關連結（如訂單、地圖）
  note: string | null;         // 備註
  created_at: Date;
  resort_id: string | null;
  resort_name: string | null;
  region: string | null;
}

/**
 * 完整的 Trip（包含 Days 和 Items）
 */
export interface TripWithDetails extends TripData {
  days: (DayData & {
    items: ItemData[];
  })[];
}

/**
 * Checklist 項目類別
 */
export type ChecklistCategory =
  | 'before_booking'    // 訂購前確認
  | 'after_booking'     // 訂購後準備
  | 'before_departure'  // 出發前確認
  | 'other';            // 其他

/**
 * Checklist 項目資料
 */
export interface ChecklistItem {
  id: string;
  trip_id: string;
  category: ChecklistCategory;
  title: string;
  completed: boolean;
  order: number;
  created_at: Date;
}

/**
 * Checklist 模板項目
 */
export interface ChecklistTemplateItem {
  category: ChecklistCategory;
  title: string;
  order: number;
}

/**
 * 打包清單項目類別
 */
export type PackingCategory =
  | 'clothing'      // 服裝防寒
  | 'documents'     // 證件金流
  | 'medicine'      // 藥品
  | 'ski_gear'      // 雪具護具
  | 'other';        // 其他

/**
 * 打包清單項目資料
 */
export interface PackingItem {
  id: string;
  trip_id: string;
  category: PackingCategory;
  title: string;
  completed: boolean;
  order: number;
  created_at: Date;
}

/**
 * 打包清單模板項目
 */
export interface PackingTemplateItem {
  category: PackingCategory;
  title: string;
  order: number;
}

/**
 * Checklist 模板（對應不同的 trip template）
 */
export interface ChecklistTemplate {
  template_id: string;
  items: ChecklistTemplateItem[];
}

/**
 * 打包清單模板（對應不同的 trip template）
 */
export interface PackingTemplate {
  template_id: string;
  items: PackingTemplateItem[];
}
