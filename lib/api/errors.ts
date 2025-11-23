/**
 * API 錯誤處理工具
 * 
 * Linus 原則：統一錯誤處理，消除重複代碼
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Zod 驗證錯誤
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: '驗證失敗',
        details: error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      { status: 400 }
    );
  }

  // 自定義 API 錯誤
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // 一般錯誤
  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // 未知錯誤
  return NextResponse.json(
    { error: '未知錯誤' },
    { status: 500 }
  );
}

// 常用錯誤快捷方法
export const notFound = (resource: string) =>
  new ApiError(404, `找不到${resource}`);

export const badRequest = (message: string) =>
  new ApiError(400, message);

export const unauthorized = () =>
  new ApiError(401, '未授權');

export const forbidden = () =>
  new ApiError(403, '禁止訪問');
