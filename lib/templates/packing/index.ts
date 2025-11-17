import { PackingTemplate } from '@/lib/types/template';
import { HOKKAIDO_6D_PACKING } from './hokkaido-6d';
import { KOREA_4D_PACKING } from './korea-4d';
import { HOKKAIDO_8D_DELUXE_PACKING } from './hokkaido-8d-deluxe';

/**
 * 所有打包清單模板
 */
export const PACKING_TEMPLATES: PackingTemplate[] = [
  HOKKAIDO_6D_PACKING,
  KOREA_4D_PACKING,
  HOKKAIDO_8D_DELUXE_PACKING,
];

/**
 * 根據 template_id 查找打包清單模板
 */
export function getPackingByTemplateId(templateId: string): PackingTemplate | undefined {
  return PACKING_TEMPLATES.find((t) => t.template_id === templateId);
}
