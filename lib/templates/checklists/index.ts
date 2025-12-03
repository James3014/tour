import { ChecklistTemplate } from '@/lib/types/template';
import { HOKKAIDO_6D_CHECKLIST } from './hokkaido-6d';
import { HOKKAIDO_8D_DELUXE_CHECKLIST } from './hokkaido-8d-deluxe';
import { NAGANO_5D_CHECKLIST } from './nagano-5d';
import { NIIGATA_4D_CHECKLIST } from './niigata-4d';
import { TOHOKU_5D_CHECKLIST } from './tohoku-5d';

/**
 * 所有 Checklist 模板
 */
export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  HOKKAIDO_6D_CHECKLIST,
  HOKKAIDO_8D_DELUXE_CHECKLIST,
  NAGANO_5D_CHECKLIST,
  NIIGATA_4D_CHECKLIST,
  TOHOKU_5D_CHECKLIST,
];

/**
 * 根據 template_id 查找 Checklist 模板
 */
export function getChecklistByTemplateId(templateId: string): ChecklistTemplate | undefined {
  return CHECKLIST_TEMPLATES.find((t) => t.template_id === templateId);
}
