import { z } from 'zod';
import { ItemType, TimeHint } from '@/lib/types/template';

// 與後端 CreateItemSchema / UpdateItemSchema 保持一致
// 但為了前端表單使用，我們允許部分欄位為空字串（後續處理轉為 null）

export const ItemFormSchema = z.object({
    type: z.enum(['flight', 'hotel', 'transfer', 'ski', 'lesson', 'todo', 'note', 'other'] as [string, ...string[]]),
    title: z.string().min(1, '標題不能為空'),
    date: z.string().optional().nullable(),
    time: z.string().optional().nullable(),
    time_hint: z.enum(['morning', 'afternoon', 'evening', 'full_day'] as [string, ...string[]]).optional().nullable(),
    location: z.string().optional().nullable(),
    link: z.string().url('請輸入有效的網址').optional().nullable().or(z.literal('')),
    note: z.string().optional().nullable(),
});

export type ItemFormValues = z.infer<typeof ItemFormSchema>;
