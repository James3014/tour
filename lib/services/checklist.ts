/**
 * Checklist & Packing 核心邏輯
 *
 * Linus 原則：
 * 1. 簡單：從模板複製到 ChecklistItem/PackingItem
 * 2. 清晰：數據流向明確
 * 3. 無特殊情況：統一處理所有 template
 * 4. 不可變性：切換狀態時返回新物件
 */

import {
  ChecklistItem,
  PackingItem,
} from '@/lib/types/template';
import { getChecklistByTemplateId } from '@/lib/templates/checklists';
import { getPackingByTemplateId } from '@/lib/templates/packing';

/**
 * 生成唯一 ID
 */
function generateId(): string {
  return crypto.randomUUID();
}

/**
 * 從模板創建 Checklist 項目
 *
 * @param template_id - 模板 ID
 * @param trip_id - 旅程 ID
 * @returns Checklist 項目陣列
 */
export function createChecklistFromTemplate(
  template_id: string,
  trip_id: string
): ChecklistItem[] {
  const template = getChecklistByTemplateId(template_id);

  if (!template) {
    // 如果找不到 checklist 模板，返回空陣列（不報錯）
    return [];
  }

  return template.items.map((itemTemplate) => ({
    id: generateId(),
    trip_id,
    category: itemTemplate.category,
    title: itemTemplate.title,
    completed: false,
    order: itemTemplate.order,
    created_at: new Date(),
  }));
}

/**
 * 從模板創建 Packing 項目
 *
 * @param template_id - 模板 ID
 * @param trip_id - 旅程 ID
 * @returns Packing 項目陣列
 */
export function createPackingFromTemplate(
  template_id: string,
  trip_id: string
): PackingItem[] {
  const template = getPackingByTemplateId(template_id);

  if (!template) {
    // 如果找不到 packing 模板，返回空陣列（不報錯）
    return [];
  }

  return template.items.map((itemTemplate) => ({
    id: generateId(),
    trip_id,
    category: itemTemplate.category,
    title: itemTemplate.title,
    completed: false,
    order: itemTemplate.order,
    created_at: new Date(),
  }));
}

/**
 * 切換 Checklist 項目的勾選狀態
 *
 * @param item - 要切換的 Checklist 項目
 * @returns 新的 ChecklistItem（completed 狀態已切換）
 */
export function toggleChecklistItem(item: ChecklistItem): ChecklistItem {
  return {
    ...item,
    completed: !item.completed,
  };
}
