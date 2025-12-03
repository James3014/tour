import { ChecklistTemplate } from '@/lib/types/template';
import { defineChecklist } from '../schema';

/**
 * 長野 5 日（白馬）行前檢查清單
 */
export const NAGANO_5D_CHECKLIST: ChecklistTemplate = defineChecklist({
  template_id: 'jp_nagano_5d3s_v1',
  items: [
    // 訂購前
    {
      category: 'before_booking',
      title: '確認東京往返機票與預算（含新幹線）',
      order: 1,
    },
    {
      category: 'before_booking',
      title: '確定同行人數與滑雪程度（方便安排八方/栂池）',
      order: 2,
    },
    {
      category: 'before_booking',
      title: '預訂白馬住宿（建議八方口或和田野）',
      order: 3,
    },
    {
      category: 'before_booking',
      title: '預留新幹線/巴士座位（長野站 ↔ 白馬）',
      order: 4,
    },
    // 訂購後
    {
      category: 'after_booking',
      title: '決定雪場行程：八方尾根 / 栂池高原 / 五龍 47',
      order: 10,
    },
    {
      category: 'after_booking',
      title: '預約滑雪課程或導覽（Evergreen / Rhythm）',
      order: 11,
    },
    {
      category: 'after_booking',
      title: '確認雪具租借與保險（粉雪/樹林建議加保）',
      order: 12,
    },
    {
      category: 'after_booking',
      title: '安排交通：白馬接駁巴士、租車或共乘',
      order: 13,
    },
    {
      category: 'after_booking',
      title: '預約溫泉（八方溫泉或和田野之森）與餐廳',
      order: 14,
    },
    // 出發前
    {
      category: 'before_departure',
      title: '下載巴士時刻 / 雪場即時雪況 App',
      order: 20,
    },
    {
      category: 'before_departure',
      title: '列印或存檔新幹線、住宿、課程、租車等憑證',
      order: 21,
    },
    {
      category: 'before_departure',
      title: '準備 Suica / 現金（白馬部分店家僅收現）',
      order: 22,
    },
    {
      category: 'before_departure',
      title: '確認雪鏈或冬季胎（若自駕）',
      order: 23,
    },
    {
      category: 'before_departure',
      title: '備妥行李轉送與飯店寄放需求',
      order: 24,
    },
    {
      category: 'before_departure',
      title: '檢查護照效期 / eSIM / 旅平險',
      order: 25,
    },
  ],
});
