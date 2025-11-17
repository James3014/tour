import { Template } from '@/lib/types/template';
import { HOKKAIDO_6D_TEMPLATE } from './hokkaido-6d';
import { TOHOKU_5D_TEMPLATE } from './tohoku-5d';
import { NAGANO_5D_TEMPLATE } from './nagano-5d';
import { NIIGATA_4D_TEMPLATE } from './niigata-4d';
import { HOKKAIDO_8D_DELUXE_TEMPLATE } from './hokkaido-8d-deluxe';
import { KOREA_4D_TEMPLATE } from './korea-4d';

/**
 * 所有可用模板
 *
 * MVP: 精選 3 個核心模板（避免選擇困難）
 * - 北海道 6 日：最經典，適合初次滑雪
 * - 韓國 4 日：預算友好，離台灣近
 * - 北海道 8 日豪華：進階玩家
 *
 * 未來擴展：移到資料庫 + 後台管理
 */
export const SKI_TEMPLATES: Template[] = [
  HOKKAIDO_6D_TEMPLATE,      // 核心 1: 最經典
  KOREA_4D_TEMPLATE,          // 核心 2: 預算友好
  HOKKAIDO_8D_DELUXE_TEMPLATE, // 核心 3: 進階選項

  // MVP 階段暫時隱藏（避免選擇困難，確保品質）
  // TOHOKU_5D_TEMPLATE,
  // NAGANO_5D_TEMPLATE,
  // NIIGATA_4D_TEMPLATE,
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
