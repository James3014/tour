/**
 * 通用的 toggle item 邏輯
 * 
 * Linus 原則：消除重複代碼，抽象共同邏輯
 */

import { NextRequest, NextResponse } from 'next/server';
import { handleApiError, notFound } from './errors';

interface ToggleableItem {
  id: string;
  completed: boolean;
}

interface ToggleItemConfig<T extends ToggleableItem> {
  getItemById: (id: string) => Promise<T | null>;
  updateItem: (id: string, item: T) => Promise<T>;
  toggleFn: (item: T) => T;
  resourceName: string;
}

/**
 * 通用的 toggle item handler
 * 用於 checklist 和 packing 的勾選切換
 */
export async function handleToggleItem<T extends ToggleableItem>(
  request: NextRequest,
  params: Promise<{ id: string }>,
  config: ToggleItemConfig<T>
): Promise<NextResponse> {
  try {
    const { id } = await params;

    // O(1) 查詢
    const item = await config.getItemById(id);
    if (!item) throw notFound(config.resourceName);

    // 切換狀態並更新
    const updatedItem = config.toggleFn(item);
    await config.updateItem(id, updatedItem);

    return NextResponse.json(updatedItem);
  } catch (error) {
    return handleApiError(error);
  }
}
