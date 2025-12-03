import { z } from 'zod';
import type { ChecklistTemplate, PackingTemplate, Template } from '@/lib/types/template';

const ItemTemplateSchema = z.object({
  type: z.string().min(1),
  title_default: z.string().min(1),
  time_hint: z.string().optional(),
  location_hint: z.string().optional(),
  note_default: z.string().optional(),
  resort_id: z.string().optional(),
  suggested_resorts: z.array(z.string()).optional(),
});

const DayTemplateSchema = z.object({
  day_index: z.number().int().min(1),
  label: z.string().min(1),
  default_city: z.string().optional(),
  is_ski_day: z.boolean(),
  default_resort_id: z.string().nullable().optional(),
  item_templates: z.array(ItemTemplateSchema),
});

export const TemplateSchema = z.object({
  template_id: z.string().min(1),
  name: z.string().min(1),
  region: z.string().min(1),
  default_days: z.number().int().min(1),
  default_ski_days: z.number().int().min(0),
  target_group: z.string().min(1),
  description: z.string().min(1),
  day_templates: z.array(DayTemplateSchema).min(1),
});

const ChecklistItemSchema = z.object({
  category: z.string(),
  title: z.string(),
  order: z.number().int(),
});

export const ChecklistTemplateSchema = z.object({
  template_id: z.string().min(1),
  items: z.array(ChecklistItemSchema),
});

const PackingItemSchema = z.object({
  category: z.string(),
  title: z.string(),
  order: z.number().int(),
});

export const PackingTemplateSchema = z.object({
  template_id: z.string().min(1),
  items: z.array(PackingItemSchema),
});

export function defineTemplate(value: Template): Template {
  TemplateSchema.parse(value);
  return value;
}

export function defineChecklist(value: ChecklistTemplate): ChecklistTemplate {
  ChecklistTemplateSchema.parse(value);
  return value;
}

export function definePacking(value: PackingTemplate): PackingTemplate {
  PackingTemplateSchema.parse(value);
  return value;
}
