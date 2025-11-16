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
 * MVP: 硬編碼 6 個模板
 * 未來擴展：移到資料庫 + 後台管理
 */
export const SKI_TEMPLATES: Template[] = [
  HOKKAIDO_6D_TEMPLATE,
  HOKKAIDO_8D_DELUXE_TEMPLATE,
  TOHOKU_5D_TEMPLATE,
  NAGANO_5D_TEMPLATE,
  NIIGATA_4D_TEMPLATE,
  KOREA_4D_TEMPLATE,
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
