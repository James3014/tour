import { ChecklistTemplate } from '@/lib/types/template';
import { defineChecklist } from '../schema';

/**
 * 東北 5 日（安比 + 藏王）行前檢查清單
 */
export const TOHOKU_5D_CHECKLIST: ChecklistTemplate = defineChecklist({
  template_id: 'jp_tohoku_5d3s_v1',
  items: [
    // 訂購前
    {
      category: 'before_booking',
      title: '確認仙台 / 花卷 / 山形航班與銜接時刻',
      order: 1,
    },
    {
      category: 'before_booking',
      title: '決定先住安比還是藏王，分別預訂住宿',
      order: 2,
    },
    {
      category: 'before_booking',
      title: '預留新幹線 (盛岡/山形) 或高速巴士座位',
      order: 3,
    },
    // 訂購後
    {
      category: 'after_booking',
      title: '確認安比高原雪場＋藏王樹冰纜車票券',
      order: 10,
    },
    {
      category: 'after_booking',
      title: '申請安比樹林滑雪許可或 CAT 行程（若需要）',
      order: 11,
    },
    {
      category: 'after_booking',
      title: '預約藏王夜間樹冰觀賞與 Ropeway',
      order: 12,
    },
    {
      category: 'after_booking',
      title: '安排行李託運（黑貓宅配）於兩地間轉送',
      order: 13,
    },
    {
      category: 'after_booking',
      title: '確認雙溫泉地（安比溫泉 / 藏王溫泉）預約',
      order: 14,
    },
    // 出發前
    {
      category: 'before_departure',
      title: '下載 JR 東日本 App、天氣、雪況與巴士資訊',
      order: 20,
    },
    {
      category: 'before_departure',
      title: '準備強效保暖（安比 -15°C、藏王夜間更低）',
      order: 21,
    },
    {
      category: 'before_departure',
      title: '確認雪路移動（冬季胎、雪鏈或接駁巴士）',
      order: 22,
    },
    {
      category: 'before_departure',
      title: '備妥護照、保險、國際駕照（若租車）',
      order: 23,
    },
    {
      category: 'before_departure',
      title: '預先設定緊急聯絡方式與天候備案（暴雪）',
      order: 24,
    },
  ],
});
