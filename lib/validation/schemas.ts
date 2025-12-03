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
  // 修复：使用 preprocess 确保 null 和空字串在 coercion 前被正确处理
  start_date: z.preprocess(
    (val) => (val === null || val === '' || val === undefined ? null : val),
    z.coerce.date().nullable()
  ).optional(),
  days: z.number().int().min(1).max(30).optional(),         // 旅程天数 (1-30)
  people_count: z.number().int().min(1).max(100).optional().nullable(), // 同行人数 (1-100)
  note: z.string().max(500, '备注过长').optional().nullable(), // 备注 (最多 500 字)
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

/**
 * PATCH /api/trips/:id - 更新旅程
 */
export const UpdateTripSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  start_date: z.preprocess(
    (val) => (val === null || val === '' || val === undefined ? null : val),
    z.coerce.date().nullable()
  ).optional(),
  people_count: z.number().int().min(1).max(100).nullable().optional(),
  note: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(500).nullable()
  ).optional(),
});

export type UpdateTripInput = z.infer<typeof UpdateTripSchema>;

/**
 * POST /api/trips/days/:id/items - 創建 Item
 */
export const CreateItemSchema = z.object({
  type: z.enum(['flight', 'hotel', 'transfer', 'ski', 'lesson', 'todo', 'note', 'other']),
  title: z.string().min(1, '標題不能為空').max(200, '標題過長'),
  date: z.preprocess(
    (val) => (val === null || val === '' || val === undefined ? null : val),
    z.coerce.date().nullable()
  ).optional(),
  time: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(10).nullable()
  ).optional(),
  time_hint: z.enum(['morning', 'afternoon', 'evening', 'full_day']).nullable().optional(),
  location: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(200).nullable()
  ).optional(),
  link: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(500).nullable()
  ).optional(),
  note: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(1000).nullable()
  ).optional(),
  resort_id: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().min(1).max(100).nullable()
  ).optional(),
});

export type CreateItemInput = z.infer<typeof CreateItemSchema>;

/**
 * PATCH /api/trips/items/:id - 更新 Item
 */
export const UpdateItemSchema = z.object({
  type: z.enum(['flight', 'hotel', 'transfer', 'ski', 'lesson', 'todo', 'note', 'other']).optional(),
  title: z.string().min(1, '標題不能為空').max(200, '標題過長').optional(),
  date: z.preprocess(
    (val) => (val === null || val === '' || val === undefined ? null : val),
    z.coerce.date().nullable()
  ).optional(),
  time: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(10).nullable()
  ).optional(),
  time_hint: z.enum(['morning', 'afternoon', 'evening', 'full_day']).nullable().optional(),
  location: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(200).nullable()
  ).optional(),
  link: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(500).nullable()
  ).optional(),
  note: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(1000).nullable()
  ).optional(),
  resort_id: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().min(1).max(100).nullable()
  ).optional(),
});

export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;

/**
 * POST /api/trips/days - 創建 Day
 */
export const CreateDaySchema = z.object({
  trip_id: z.string().min(1, 'Trip ID 不能為空'),
  day_index: z.number().int().min(1),
  label: z.string().min(1).max(100),
  city: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(100).nullable()
  ).optional(),
  is_ski_day: z.boolean(),
  resort_id: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().min(1).max(100).nullable()
  ).optional(),
});

export type CreateDayInput = z.infer<typeof CreateDaySchema>;

/**
 * PATCH /api/trips/days/:id - 更新 Day
 */
export const UpdateDaySchema = z.object({
  day_index: z.number().int().min(1).optional(),
  label: z.string().min(1).max(100).optional(),
  city: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().max(100).nullable()
  ).optional(),
  is_ski_day: z.boolean().optional(),
  resort_id: z.preprocess(
    (val) => (val === '' ? null : val),
    z.string().min(1).max(100).nullable()
  ).optional(),
});

export type UpdateDayInput = z.infer<typeof UpdateDaySchema>;
