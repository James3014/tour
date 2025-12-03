import { Template } from '@/lib/types/template';
import { defineTemplate } from './schema';

/**
 * 北海道 8 日豪華版・5 天滑雪（二世古 + 富良野）
 */
export const HOKKAIDO_8D_DELUXE_TEMPLATE: Template = defineTemplate({
  template_id: 'jp_hokkaido_8d5s_deluxe_v1',
  name: '北海道 8 日豪華版・二世古 + 富良野',
  region: 'Japan / Hokkaido',
  default_days: 8,
  default_ski_days: 5,
  target_group: '中高階、4-8 人團隊',
  description: '深度體驗二世古 + 富良野兩大雪場，5 天滑雪盡享世界級粉雪',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達北海道',
      default_city: '札幌',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '直飛新千歲機場',
        },
        {
          type: 'transfer',
          title_default: '機場 → 二世古',
          time_hint: 'afternoon',
          note_default: '自駕或包車前往二世古（約 2.5 小時）',
        },
        {
          type: 'hotel',
          title_default: '二世古度假村',
          time_hint: 'evening',
          note_default: '建議入住 Hirafu 或 Annupuri 區域',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1 - 二世古',
      default_city: '二世古',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '二世古 Grand Hirafu',
          time_hint: 'full_day',
          location_hint: 'Hirafu 雪場',
          note_default: '世界級粉雪，適合各級別',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2 - 二世古',
      default_city: '二世古',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '二世古 Annupuri',
          time_hint: 'full_day',
          location_hint: 'Annupuri 雪場',
          note_default: '較少人潮，粉雪品質更佳',
        },
      ],
    },
    {
      day_index: 4,
      label: '移動日',
      default_city: '二世古 → 富良野',
      is_ski_day: false,
      item_templates: [
        {
          type: 'transfer',
          title_default: '二世古 → 富良野',
          time_hint: 'morning',
          note_default: '自駕約 3.5 小時，沿途可停靠小樽',
        },
        {
          type: 'note',
          title_default: '小樽觀光',
          time_hint: 'afternoon',
          location_hint: '小樽運河',
          note_default: '運河、音樂盒堂、壽司街',
        },
        {
          type: 'hotel',
          title_default: '富良野住宿',
          time_hint: 'evening',
          note_default: '入住富良野地區',
        },
      ],
    },
    {
      day_index: 5,
      label: '滑雪日 3 - 富良野',
      default_city: '富良野',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '富良野滑雪場',
          time_hint: 'full_day',
          note_default: '景觀優美，樹林間滑雪',
        },
      ],
    },
    {
      day_index: 6,
      label: '滑雪日 4 - 富良野',
      default_city: '富良野',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '富良野滑雪場',
          time_hint: 'full_day',
          note_default: '繼續享受富良野粉雪',
        },
      ],
    },
    {
      day_index: 7,
      label: '滑雪日 5 + 移動',
      default_city: '富良野 → 札幌',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '富良野半日滑雪',
          time_hint: 'morning',
          note_default: '上午最後滑雪',
        },
        {
          type: 'note',
          title_default: '退租雪具',
          time_hint: 'afternoon',
          note_default: '歸還雪具、整理行李',
        },
        {
          type: 'transfer',
          title_default: '富良野 → 札幌',
          time_hint: 'afternoon',
          note_default: '前往札幌市區',
        },
        {
          type: 'hotel',
          title_default: '札幌市區住宿',
          time_hint: 'evening',
          note_default: '入住札幌，逛街購物',
        },
      ],
    },
    {
      day_index: 8,
      label: '札幌市區＆回程',
      default_city: '札幌',
      is_ski_day: false,
      item_templates: [
        {
          type: 'note',
          title_default: '札幌市區',
          time_hint: 'morning',
          note_default: '狸小路、二條市場、薄野',
        },
        {
          type: 'transfer',
          title_default: '札幌 → 機場',
          time_hint: 'afternoon',
          note_default: '前往新千歲機場',
        },
        {
          type: 'flight',
          title_default: '回程航班',
          time_hint: 'evening',
          note_default: '返台',
        },
      ],
    },
  ],
});
