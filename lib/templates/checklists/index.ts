import { ChecklistTemplate } from '@/lib/types/template';
import { HOKKAIDO_6D_CHECKLIST } from './hokkaido-6d';
import { KOREA_4D_CHECKLIST } from './korea-4d';
import { HOKKAIDO_8D_DELUXE_CHECKLIST } from './hokkaido-8d-deluxe';

/**
 * 所有 Checklist 模板
 */
export const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  HOKKAIDO_6D_CHECKLIST,
  KOREA_4D_CHECKLIST,
  HOKKAIDO_8D_DELUXE_CHECKLIST,
];

/**
 * 根據 template_id 查找 Checklist 模板
 */
export function getChecklistByTemplateId(templateId: string): ChecklistTemplate | undefined {
  return CHECKLIST_TEMPLATES.find((t) => t.template_id === templateId);
}
