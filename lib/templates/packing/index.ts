import { PackingTemplate } from '@/lib/types/template';
import { HOKKAIDO_6D_PACKING } from './hokkaido-6d';
import { HOKKAIDO_8D_DELUXE_PACKING } from './hokkaido-8d-deluxe';
import { NAGANO_5D_PACKING } from './nagano-5d';
import { NIIGATA_4D_PACKING } from './niigata-4d';
import { TOHOKU_5D_PACKING } from './tohoku-5d';

/**
 * 所有打包清單模板
 */
export const PACKING_TEMPLATES: PackingTemplate[] = [
  HOKKAIDO_6D_PACKING,
  HOKKAIDO_8D_DELUXE_PACKING,
  NAGANO_5D_PACKING,
  NIIGATA_4D_PACKING,
  TOHOKU_5D_PACKING,
];

/**
 * 根據 template_id 查找打包清單模板
 */
export function getPackingByTemplateId(templateId: string): PackingTemplate | undefined {
  return PACKING_TEMPLATES.find((t) => t.template_id === templateId);
}
