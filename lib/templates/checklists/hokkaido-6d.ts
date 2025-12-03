import { ChecklistTemplate, ChecklistTemplateItem } from '@/lib/types/template';
import { defineChecklist } from '../schema';

/**
 * 北海道 6 日滑雪行前檢查清單
 *
 * 設計原則：
 * - 按時間順序分類（訂購前 → 訂購後 → 出發前）
 * - 實用為主，避免過度細節
 * - 適合初次滑雪的人
 */
export const HOKKAIDO_6D_CHECKLIST: ChecklistTemplate = defineChecklist({
  template_id: 'jp_hokkaido_6d3s1c_v1',
  items: [
    // 訂購前確認
    {
      category: 'before_booking',
      title: '確認護照效期（需 6 個月以上）',
      order: 1,
    },
    {
      category: 'before_booking',
      title: '確認預算與出發日期',
      order: 2,
    },
    {
      category: 'before_booking',
      title: '確認同行人數與滑雪程度',
      order: 3,
    },
    {
      category: 'before_booking',
      title: '預訂機票（桃園 ↔ 新千歲）',
      order: 4,
    },
    {
      category: 'before_booking',
      title: '預訂雪場附近住宿（至少 3 晚）',
      order: 5,
    },
    {
      category: 'before_booking',
      title: '預訂札幌市區住宿（1 晚）',
      order: 6,
    },

    // 訂購後準備
    {
      category: 'after_booking',
      title: '確認雪場營業時間與纜車票購買方式',
      order: 10,
    },
    {
      category: 'after_booking',
      title: '決定是否預訂滑雪課程（建議初學者）',
      order: 11,
    },
    {
      category: 'after_booking',
      title: '確認雪具租借方式（雪場 or 市區）',
      order: 12,
    },
    {
      category: 'after_booking',
      title: '規劃交通方式（租車/JR/巴士）',
      order: 13,
    },
    {
      category: 'after_booking',
      title: '購買旅遊平安險（建議含滑雪意外）',
      order: 14,
    },
    {
      category: 'after_booking',
      title: '辦理日本上網卡或 WiFi 分享器',
      order: 15,
    },
    {
      category: 'after_booking',
      title: '下載離線地圖與交通 App',
      order: 16,
    },

    // 出發前確認
    {
      category: 'before_departure',
      title: '確認天氣預報與雪況',
      order: 20,
    },
    {
      category: 'before_departure',
      title: '列印或存檔所有訂單（機票、住宿、租車）',
      order: 21,
    },
    {
      category: 'before_departure',
      title: '確認飯店 check-in 時間與交通方式',
      order: 22,
    },
    {
      category: 'before_departure',
      title: '準備日圓現金（建議 3-5 萬日圓）',
      order: 23,
    },
    {
      category: 'before_departure',
      title: '通知信用卡公司出國刷卡',
      order: 24,
    },
    {
      category: 'before_departure',
      title: '確認回程航班時間與機場交通',
      order: 25,
    },
  ],
});
