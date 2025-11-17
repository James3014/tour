/**
 * Trip 核心邏輯
 *
 * Linus 原則：
 * 1. 簡單：從模板複製到 Trip/Day/Item
 * 2. 清晰：數據流向明確
 * 3. 無特殊情況：統一處理所有 template
 */

import {
  CreateTripFromTemplateInput,
  TripWithDetails,
  DayData,
  ItemData,
} from '@/lib/types/template';
import { getTemplateById } from '@/lib/templates';

/**
 * 生成唯一 ID
 * 使用 Node.js 内置的 crypto.randomUUID()，保证全局唯一性
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 從模板創建 Trip
 *
 * @param input - 包含 template_id, user_id, title, start_date, days, people_count, note
 * @returns 完整的 Trip（包含 Days 和 Items）
 */
export function createTripFromTemplate(
  input: CreateTripFromTemplateInput
): TripWithDetails {
  const {
    template_id,
    user_id,
    title,
    start_date,
    days,
    people_count,
    note
  } = input;

  // 1. 查找模板
  const template = getTemplateById(template_id);
  if (!template) {
    throw new Error(`找不到模板: ${template_id}`);
  }

  // 2. 決定使用幾天（用戶指定 or 模板預設）
  const numDays = days ?? template.default_days;

  // 3. 創建 Trip
  const tripId = generateId();
  const trip: TripWithDetails = {
    id: tripId,
    template_id,
    user_id,
    title: title || template.name,         // 使用自定義標題或模板名稱
    start_date: start_date ?? null,        // 出發日期
    people_count: people_count ?? null,    // 預計同行人數
    note: note ?? null,                    // 簡短備註
    created_at: new Date(),
    updated_at: new Date(),
    days: [],
  };

  // 4. 從 day_templates 生成 Days（只生成需要的天數）
  const dayTemplatesToUse = template.day_templates.slice(0, numDays);

  trip.days = dayTemplatesToUse.map((dayTemplate) => {
    const dayId = generateId();

    const day: DayData & { items: ItemData[] } = {
      id: dayId,
      trip_id: tripId,
      day_index: dayTemplate.day_index,
      label: dayTemplate.label,
      city: dayTemplate.default_city || null,
      is_ski_day: dayTemplate.is_ski_day,
      items: [],
    };

    // 5. 從 item_templates 生成 Items
    day.items = dayTemplate.item_templates.map((itemTemplate) => {
      const item: ItemData = {
        id: generateId(),
        day_id: dayId,
        type: itemTemplate.type,
        title: itemTemplate.title_default,
        date: null,                               // 具體日期（待用戶填寫）
        time: null,                               // 具體時間（待用戶填寫）
        time_hint: itemTemplate.time_hint || null, // 時間提示（早上/下午/晚上）
        location: itemTemplate.location_hint || null,
        link: null,                               // 相關連結（待用戶填寫）
        note: itemTemplate.note_default || null,
        created_at: new Date(),
      };

      return item;
    });

    return day;
  });

  return trip;
}
