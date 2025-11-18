/**
 * API 輸入驗證 schemas
 *
 * Linus 原則：防禦性編程，但不要過度
 * 驗證輸入格式，防止垃圾資料進入系統
 */

import { z } from 'zod';

/**
 * POST /api/trips - 創建旅程
 */
export const CreateTripSchema = z.object({
  template_id: z.string().min(1, '模板 ID 不能為空').max(100, '模板 ID 過長'),
  user_id: z.string().min(1, '使用者 ID 不能為空').max(100, '使用者 ID 過長'),
  title: z.string().max(200, '標題過長').optional(),
  start_date: z.string().nullish(),  // 日期字串 (YYYY-MM-DD 或 ISO 8601)，可為 null/undefined
  days: z.number().int().min(1).max(30).optional(),         // 旅程天數 (1-30)
  people_count: z.number().int().min(1).max(100).optional().nullable(), // 同行人數 (1-100)
  note: z.string().max(500, '備註過長').optional().nullable(), // 備註 (最多 500 字)
});

export type CreateTripInput = z.infer<typeof CreateTripSchema>;

/**
 * GET /api/trips?user_id=xxx - 獲取使用者旅程列表
 */
export const GetTripsSchema = z.object({
  user_id: z.string().min(1, '使用者 ID 不能為空').max(100, '使用者 ID 過長'),
});

export type GetTripsInput = z.infer<typeof GetTripsSchema>;

/**
 * GET /api/trips/:id - 獲取單個旅程
 */
export const GetTripByIdSchema = z.object({
  id: z.string().min(1, '旅程 ID 不能為空'),
});

export type GetTripByIdInput = z.infer<typeof GetTripByIdSchema>;
