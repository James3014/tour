/**
 * API 输入验证 schemas
 *
 * Linus 原则：防御性编程，但不要过度
 * 验证输入格式，防止垃圾数据进入系统
 */

import { z } from 'zod';

/**
 * POST /api/trips - 创建旅程
 */
export const CreateTripSchema = z.object({
  template_id: z.string().min(1, '模板 ID 不能为空').max(100, '模板 ID 过长'),
  user_id: z.string().min(1, '用户 ID 不能为空').max(100, '用户 ID 过长'),
  title: z.string().max(200, '标题过长').optional(),
});

export type CreateTripInput = z.infer<typeof CreateTripSchema>;

/**
 * GET /api/trips?user_id=xxx - 获取用户旅程列表
 */
export const GetTripsSchema = z.object({
  user_id: z.string().min(1, '用户 ID 不能为空').max(100, '用户 ID 过长'),
});

export type GetTripsInput = z.infer<typeof GetTripsSchema>;

/**
 * GET /api/trips/:id - 获取单个旅程
 */
export const GetTripByIdSchema = z.object({
  id: z.string().min(1, '旅程 ID 不能为空'),
});

export type GetTripByIdInput = z.infer<typeof GetTripByIdSchema>;
