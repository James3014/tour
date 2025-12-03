import { Template } from '@/lib/types/template';
import { defineTemplate } from './schema';

/**
 * 長野 5 日・白馬多雪場體驗
 */
export const NAGANO_5D_TEMPLATE: Template = defineTemplate({
  template_id: 'jp_nagano_5d3s_v1',
  name: '長野 5 日・白馬多雪場體驗',
  region: 'Japan / Nagano',
  default_days: 5,
  default_ski_days: 3,
  target_group: '中階～進階、喜歡粉雪與多樣地形',
  description: '一次玩遍白馬八方尾根、栂池高原與白馬五龍，搭配溫泉與在地美食',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達白馬',
      default_city: '白馬村',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '建議飛東京（成田/羽田）後轉乘新幹線',
        },
        {
          type: 'transfer',
          title_default: '東京 → 白馬',
          time_hint: 'afternoon',
          location_hint: '長野站 / 白馬八方巴士總站',
          note_default: '可選擇白馬直達巴士或北陸新幹線 + 巴士',
        },
        {
          type: 'hotel',
          title_default: '白馬住宿入住',
          time_hint: 'evening',
          note_default: '建議選擇八方口或和田野區域，方便接駁巴士',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1 — 八方尾根',
      default_city: '白馬村',
      is_ski_day: true,
      default_resort_id: 'hakuba_happo_one',
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 八方尾根',
          time_hint: 'morning',
          note_default: '確認接駁巴士時刻或自駕停車場',
        },
        {
          type: 'ski',
          title_default: '八方尾根滑雪日',
          time_hint: 'full_day',
          resort_id: 'hakuba_happo_one',
          suggested_resorts: ['hakuba_tsugaike_kogen', 'hakuba_cortina'],
          note_default: '1998 冬奧賽道，建議熟悉 Panorama 與 Riesen 線',
        },
        {
          type: 'lesson',
          title_default: '英文/中文教練課（選填）',
          time_hint: 'morning',
          resort_id: 'hakuba_happo_one',
          note_default: '若需私人課請提前預約 Evergreen 或 Rhythm',
        },
        {
          type: 'note',
          title_default: '溫泉 & 晚餐安排',
          time_hint: 'evening',
          note_default: '可前往八方溫泉，晚餐試試信州牛或當地居酒屋',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2 — 栂池高原',
      default_city: '白馬村',
      is_ski_day: true,
      default_resort_id: 'hakuba_tsugaike_kogen',
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 栂池高原',
          time_hint: 'morning',
          note_default: '接駁巴士約 30 分，記得備註行李置物需求',
        },
        {
          type: 'ski',
          title_default: '栂池高原寬廣緩坡',
          time_hint: 'full_day',
          resort_id: 'hakuba_tsugaike_kogen',
          suggested_resorts: ['hakuba_goryu_47'],
          note_default: '適合全家同樂，可安排樹林滑雪導覽',
        },
        {
          type: 'note',
          title_default: '夜訪白馬村',
          time_hint: 'evening',
          note_default: '推薦逛和田野十字路口或去 Lawson 入手在地限量甜點',
        },
      ],
    },
    {
      day_index: 4,
      label: '滑雪日 3 — 白馬五龍 & 47',
      default_city: '白馬村',
      is_ski_day: true,
      default_resort_id: 'hakuba_goryu_47',
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 五龍/47',
          time_hint: 'morning',
          note_default: '根據雪況決定走五龍或 47 方向',
        },
        {
          type: 'ski',
          title_default: '白馬五龍 / Hakuba47 自由滑',
          time_hint: 'full_day',
          resort_id: 'hakuba_goryu_47',
          suggested_resorts: ['hakuba_norikura'],
          note_default: '上午衝粉雪，下午可到 47 snow park 拍照',
        },
        {
          type: 'note',
          title_default: '退租雪具 + 打包',
          time_hint: 'afternoon',
          note_default: '記錄租借品項、整理行李並確認交通',
        },
      ],
    },
    {
      day_index: 5,
      label: '回程',
      default_city: '白馬 → 東京 → 台灣',
      is_ski_day: false,
      item_templates: [
        {
          type: 'transfer',
          title_default: '白馬 → 長野 / 機場',
          time_hint: 'morning',
          note_default: '預留 5-6 小時銜接返台航班',
        },
        {
          type: 'flight',
          title_default: '回程航班',
          time_hint: 'afternoon',
          note_default: '從成田或羽田返台，記得退稅與購物',
        },
      ],
    },
  ],
});
