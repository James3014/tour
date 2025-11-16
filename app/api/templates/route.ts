import { NextResponse } from 'next/server';
import { getAllTemplates } from '@/lib/templates';

/**
 * GET /api/templates
 * 獲取所有可用模板
 */
export async function GET() {
  try {
    const templates = getAllTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    const message = error instanceof Error ? error.message : '未知錯誤';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
