import { ChecklistTemplate, ChecklistTemplateItem } from '@/lib/types/template';

/**
 * 韓國 4 日滑雪行前檢查清單
 *
 * 設計原則：
 * - 短期行程，簡化版本
 * - 強調預算友好與快速出發
 * - 適合第一次出國滑雪的人
 */
export const KOREA_4D_CHECKLIST: ChecklistTemplate = {
  template_id: 'kr_yongpyong_4d2s_v1',
  items: [
    // 訂購前確認
    {
      category: 'before_booking',
      title: '確認護照效期（需 6 個月以上）',
      order: 1,
    },
    {
      category: 'before_booking',
      title: '確認預算與出發日期（4 天短期）',
      order: 2,
    },
    {
      category: 'before_booking',
      title: '預訂機票（桃園 ↔ 仁川/金浦）',
      order: 3,
    },
    {
      category: 'before_booking',
      title: '預訂龍平度假村住宿（2 晚）',
      order: 4,
    },
    {
      category: 'before_booking',
      title: '預訂首爾市區住宿（1 晚）',
      order: 5,
    },

    // 訂購後準備
    {
      category: 'after_booking',
      title: '確認龍平雪場營業時間與纜車票',
      order: 10,
    },
    {
      category: 'after_booking',
      title: '決定是否預訂滑雪課程（建議初學者）',
      order: 11,
    },
    {
      category: 'after_booking',
      title: '確認雪具租借方式（雪場提供）',
      order: 12,
    },
    {
      category: 'after_booking',
      title: '預訂首爾 ↔ 龍平交通（巴士/包車）',
      order: 13,
    },
    {
      category: 'after_booking',
      title: '購買旅遊平安險',
      order: 14,
    },
    {
      category: 'after_booking',
      title: '辦理韓國上網卡或 eSIM',
      order: 15,
    },

    // 出發前確認
    {
      category: 'before_departure',
      title: '確認天氣預報與雪況',
      order: 20,
    },
    {
      category: 'before_departure',
      title: '列印或存檔所有訂單',
      order: 21,
    },
    {
      category: 'before_departure',
      title: '準備韓圓現金（建議 20-30 萬韓圓）',
      order: 22,
    },
    {
      category: 'before_departure',
      title: '確認回程航班時間',
      order: 23,
    },
  ],
};
