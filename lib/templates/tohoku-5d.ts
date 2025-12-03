import { Template } from '@/lib/types/template';
import { defineTemplate } from './schema';

/**
 * 東北 5 日・安比 + 藏王樹冰
 */
export const TOHOKU_5D_TEMPLATE: Template = defineTemplate({
  template_id: 'jp_tohoku_5d3s_v1',
  name: '東北 5 日・安比 + 藏王樹冰',
  region: 'Japan / Tohoku',
  default_days: 5,
  default_ski_days: 3,
  target_group: '初學～中階、喜歡樹冰粉雪與溫泉療癒',
  description: '北上盛岡住安比高原，最後移動到山形藏王看樹冰與泡溫泉',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達盛岡/安比',
      default_city: '盛岡 / 安比高原',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '飛仙台或花卷機場，再轉乘新幹線至盛岡',
        },
        {
          type: 'transfer',
          title_default: '盛岡 → 安比高原',
          time_hint: 'afternoon',
          note_default: 'JR 花輪線或飯店接駁巴士約 60 分鐘',
        },
        {
          type: 'hotel',
          title_default: '安比高原度假村入住',
          time_hint: 'evening',
          note_default: '建議入住 Tower 或 Grand Annex，方便滑進滑出',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1 — 安比高原',
      default_city: '安比高原',
      is_ski_day: true,
      default_resort_id: 'iwate_appi_kogen',
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 安比雪場',
          time_hint: 'morning',
          note_default: '步行或飯店接駁車 5 分鐘內到達纜車站',
        },
        {
          type: 'ski',
          title_default: '安比高原粉雪日',
          time_hint: 'full_day',
          resort_id: 'iwate_appi_kogen',
          suggested_resorts: ['iwate_shizukuishi'],
          note_default: '體驗長距離整備雪道與 Sailer 線粉雪',
        },
        {
          type: 'lesson',
          title_default: '私人課程（選填）',
          time_hint: 'morning',
          resort_id: 'iwate_appi_kogen',
          note_default: '飯店提供英文/中文教練，可提前預約',
        },
        {
          type: 'note',
          title_default: '安比溫泉 / 鐵板燒',
          time_hint: 'evening',
          note_default: '推薦泡白樺之湯，晚餐嚐嚐安比牛鐵板燒',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2 — 安比深度',
      default_city: '安比高原',
      is_ski_day: true,
      default_resort_id: 'iwate_appi_kogen',
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 雪場',
          time_hint: 'morning',
          note_default: '可選擇 CAT 滑或樹林導覽，視雪況決定',
        },
        {
          type: 'ski',
          title_default: '安比樹林 & 野雪體驗',
          time_hint: 'full_day',
          resort_id: 'iwate_appi_kogen',
          suggested_resorts: ['iwate_shizukuishi'],
          note_default: '申請樹林滑雪許可，探訪 Hachimantai 樹冰',
        },
        {
          type: 'note',
          title_default: '移動至山形藏王',
          time_hint: 'evening',
          note_default: '搭新幹線約 3.5 小時，晚間入住藏王溫泉',
        },
      ],
    },
    {
      day_index: 4,
      label: '滑雪日 3 — 藏王樹冰',
      default_city: '藏王溫泉',
      is_ski_day: true,
      default_resort_id: 'yamagata_zao_onsen',
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 藏王 Ropeway',
          time_hint: 'morning',
          note_default: '早起排隊搭乘纜車上山欣賞樹冰',
        },
        {
          type: 'ski',
          title_default: '藏王樹冰巡禮',
          time_hint: 'full_day',
          resort_id: 'yamagata_zao_onsen',
          suggested_resorts: ['fukushima_nekoma_mountain'],
          note_default: '上午滑樹冰原，午後拍攝樹冰怪獸並安排夜間點燈',
        },
        {
          type: 'note',
          title_default: '退租雪具 / 藏王溫泉街',
          time_hint: 'evening',
          note_default: '歸還雪具後逛溫泉街，品嚐玉こんにゃく與炸豆腐皮',
        },
      ],
    },
    {
      day_index: 5,
      label: '回程',
      default_city: '山形 → 仙台 / 台灣',
      is_ski_day: false,
      item_templates: [
        {
          type: 'transfer',
          title_default: '藏王溫泉 → 仙台/山形機場',
          time_hint: 'morning',
          note_default: '巴士或租車約 1.5-2 小時，留意雪路時間',
        },
        {
          type: 'flight',
          title_default: '回程航班',
          time_hint: 'afternoon',
          note_default: '仙台/山形飛東京後轉國際航班返台',
        },
      ],
    },
  ],
});
