import { Template } from '@/lib/types/template';
import { HOKKAIDO_6D_TEMPLATE } from './hokkaido-6d';
import { TOHOKU_5D_TEMPLATE } from './tohoku-5d';
import { NAGANO_5D_TEMPLATE } from './nagano-5d';
import { NIIGATA_4D_TEMPLATE } from './niigata-4d';
import { HOKKAIDO_8D_DELUXE_TEMPLATE } from './hokkaido-8d-deluxe';

/**
 * 所有可用模板
 *
 * 精選 5 套對應真實雪場資料的行程：
 * - 北海道 6 日：經典入門
 * - 北海道 8 日豪華：進階玩家
 * - 長野 5 日：白馬多雪場
 * - 新潟 4 日：苗場/田代週末快閃
 * - 東北 5 日：安比 + 藏王樹冰
 */
export const SKI_TEMPLATES: Template[] = [
  HOKKAIDO_6D_TEMPLATE,
  HOKKAIDO_8D_DELUXE_TEMPLATE,
  NAGANO_5D_TEMPLATE,
  NIIGATA_4D_TEMPLATE,
  TOHOKU_5D_TEMPLATE,
];

/**
 * 根據 template_id 查找模板
 */
export function getTemplateById(templateId: string): Template | undefined {
  return SKI_TEMPLATES.find((t) => t.template_id === templateId);
}

/**
 * 獲取所有模板（用於列表頁）
 */
export function getAllTemplates(): Template[] {
  return SKI_TEMPLATES;
}
