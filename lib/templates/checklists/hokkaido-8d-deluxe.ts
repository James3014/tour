import { ChecklistTemplate, ChecklistTemplateItem } from '@/lib/types/template';
import { defineChecklist } from '../schema';

/**
 * 北海道 8 日豪華版滑雪行前檢查清單
 *
 * 設計原則：
 * - 進階行程，更詳細的準備項目
 * - 涵蓋二世古 + 富良野雙雪場
 * - 自駕為主，需要更多交通規劃
 */
export const HOKKAIDO_8D_DELUXE_CHECKLIST: ChecklistTemplate = defineChecklist({
  template_id: 'jp_hokkaido_8d5s_deluxe_v1',
  items: [
    // 訂購前確認
    {
      category: 'before_booking',
      title: '確認護照效期（需 6 個月以上）',
      order: 1,
    },
    {
      category: 'before_booking',
      title: '確認預算與出發日期（8 天較長行程）',
      order: 2,
    },
    {
      category: 'before_booking',
      title: '確認同行人數與滑雪程度（中高階）',
      order: 3,
    },
    {
      category: 'before_booking',
      title: '預訂機票（桃園 ↔ 新千歲）',
      order: 4,
    },
    {
      category: 'before_booking',
      title: '預訂二世古住宿（2 晚）',
      order: 5,
    },
    {
      category: 'before_booking',
      title: '預訂富良野住宿（3 晚）',
      order: 6,
    },
    {
      category: 'before_booking',
      title: '預訂札幌市區住宿（1 晚）',
      order: 7,
    },

    // 訂購後準備
    {
      category: 'after_booking',
      title: '確認二世古與富良野雪場營業時間',
      order: 10,
    },
    {
      category: 'after_booking',
      title: '購買二世古與富良野纜車票（可線上預訂）',
      order: 11,
    },
    {
      category: 'after_booking',
      title: '確認雪具租借方式（建議攜帶自己的板子）',
      order: 12,
    },
    {
      category: 'after_booking',
      title: '預訂租車（建議 4WD 雪地車）',
      order: 13,
    },
    {
      category: 'after_booking',
      title: '申請日本駕照譯本（監理站辦理）',
      order: 14,
    },
    {
      category: 'after_booking',
      title: '規劃自駕路線（二世古 → 小樽 → 富良野）',
      order: 15,
    },
    {
      category: 'after_booking',
      title: '購買旅遊平安險（含滑雪意外與自駕）',
      order: 16,
    },
    {
      category: 'after_booking',
      title: '辦理日本上網卡或 WiFi 分享器',
      order: 17,
    },
    {
      category: 'after_booking',
      title: '下載離線地圖與導航 App（Google Maps/Navitime）',
      order: 18,
    },
    {
      category: 'after_booking',
      title: '預訂二世古或富良野的美食餐廳',
      order: 19,
    },

    // 出發前確認
    {
      category: 'before_departure',
      title: '確認天氣預報與兩個雪場雪況',
      order: 20,
    },
    {
      category: 'before_departure',
      title: '列印或存檔所有訂單（機票、住宿、租車）',
      order: 21,
    },
    {
      category: 'before_departure',
      title: '確認租車公司取車/還車地點與時間',
      order: 22,
    },
    {
      category: 'before_departure',
      title: '準備日圓現金（建議 5-8 萬日圓）',
      order: 23,
    },
    {
      category: 'before_departure',
      title: '通知信用卡公司出國刷卡',
      order: 24,
    },
    {
      category: 'before_departure',
      title: '確認駕照譯本與台灣駕照都攜帶',
      order: 25,
    },
    {
      category: 'before_departure',
      title: '確認回程航班時間與機場交通',
      order: 26,
    },
  ],
});
