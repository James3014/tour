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
 * @param input - 包含 template_id, user_id, title
 * @returns 完整的 Trip（包含 Days 和 Items）
 */
export function createTripFromTemplate(
  input: CreateTripFromTemplateInput
): TripWithDetails {
  const { template_id, user_id, title } = input;

  // 1. 查找模板
  const template = getTemplateById(template_id);
  if (!template) {
    throw new Error(`找不到模板: ${template_id}`);
  }

  // 2. 創建 Trip
  const tripId = generateId();
  const trip: TripWithDetails = {
    id: tripId,
    template_id,
    user_id,
    title: title || template.name, // 使用自定義標題或模板名稱
    created_at: new Date(),
    updated_at: new Date(),
    days: [],
  };

  // 3. 從 day_templates 生成 Days
  trip.days = template.day_templates.map((dayTemplate) => {
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

    // 4. 從 item_templates 生成 Items
    day.items = dayTemplate.item_templates.map((itemTemplate) => {
      const item: ItemData = {
        id: generateId(),
        day_id: dayId,
        type: itemTemplate.type,
        title: itemTemplate.title_default,
        time_hint: itemTemplate.time_hint || null,
        location: itemTemplate.location_hint || null,
        note: itemTemplate.note_default || null,
        created_at: new Date(),
      };

      return item;
    });

    return day;
  });

  return trip;
}
