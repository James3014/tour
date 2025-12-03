import { ChecklistTemplate } from '@/lib/types/template';
import { defineChecklist } from '../schema';

/**
 * 新潟 4 日（苗場）行前檢查清單
 */
export const NIIGATA_4D_CHECKLIST: ChecklistTemplate = defineChecklist({
  template_id: 'jp_niigata_4d2s_v1',
  items: [
    // 訂購前
    {
      category: 'before_booking',
      title: '確認東京往返航班與行程日期（需請 2 天假）',
      order: 1,
    },
    {
      category: 'before_booking',
      title: '預訂苗場王子或越後湯澤住宿',
      order: 2,
    },
    {
      category: 'before_booking',
      title: '預約上越新幹線來回指定席',
      order: 3,
    },
    // 訂購後
    {
      category: 'after_booking',
      title: '加購苗場 / 田代纜車票與龍纜車套票',
      order: 10,
    },
    {
      category: 'after_booking',
      title: '預約中文/英文教練或團體課程',
      order: 11,
    },
    {
      category: 'after_booking',
      title: '安排雪具租借（苗場王子或新宿店取件）',
      order: 12,
    },
    {
      category: 'after_booking',
      title: '確認龍纜車 / 神立夜滑接駁時刻',
      order: 13,
    },
    {
      category: 'after_booking',
      title: '規劃東京回程購物與行李寄放',
      order: 14,
    },
    // 出發前
    {
      category: 'before_departure',
      title: '備好 Suica / 現金（湯澤小店仍以現金為主）',
      order: 20,
    },
    {
      category: 'before_departure',
      title: '確認雪場接駁巴士預約與集合點',
      order: 21,
    },
    {
      category: 'before_departure',
      title: '下載湯澤即時交通與天氣 App（JR 東日本）',
      order: 22,
    },
    {
      category: 'before_departure',
      title: '準備溫泉入場用品（毛巾、泳裝選配）',
      order: 23,
    },
    {
      category: 'before_departure',
      title: '檢查護照、保險、eSIM、回程時間',
      order: 24,
    },
  ],
});
