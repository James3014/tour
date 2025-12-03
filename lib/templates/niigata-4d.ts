import { Template } from '@/lib/types/template';
import { defineTemplate } from './schema';

/**
 * 新潟 4 日・苗場／田代快閃
 */
export const NIIGATA_4D_TEMPLATE: Template = defineTemplate({
  template_id: 'jp_niigata_4d2s_v1',
  name: '新潟 4 日・苗場／田代快閃',
  region: 'Japan / Niigata',
  default_days: 4,
  default_ski_days: 2,
  target_group: '初學～中階、週末快速滑雪',
  description: '越後湯澤 90 分鐘就到，玩苗場＋田代＋加碼新幹線購物日',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達越後湯澤',
      default_city: '越後湯澤 / 苗場',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '飛往東京後銜接新幹線',
        },
        {
          type: 'transfer',
          title_default: '東京 → 越後湯澤 → 苗場',
          time_hint: 'afternoon',
          location_hint: '上越新幹線 + 巴士',
          note_default: '東京至湯澤 80 分，再接駁 40 分到苗場王子',
        },
        {
          type: 'hotel',
          title_default: '苗場王子或湯澤住宿',
          time_hint: 'evening',
          note_default: 'Ski-in/Ski-out，先預約租借雪具',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1 — 苗場',
      default_city: '苗場',
      is_ski_day: true,
      default_resort_id: 'yuzawa_naeba',
      item_templates: [
        {
          type: 'ski',
          title_default: '苗場本館滑雪日',
          time_hint: 'full_day',
          resort_id: 'yuzawa_naeba',
          suggested_resorts: ['yuzawa_gala', 'yuzawa_ishiuchi_maruyama'],
          note_default: '體驗苗場標誌性初級長坡與世界最長龍纜車',
        },
        {
          type: 'lesson',
          title_default: '半日課程 / 中文教練',
          time_hint: 'morning',
          resort_id: 'yuzawa_naeba',
          note_default: '建議預約中文教練體驗快速上手',
        },
        {
          type: 'note',
          title_default: '越後湯澤溫泉 & 居酒屋',
          time_hint: 'evening',
          note_default: '可到越後湯澤溫泉街、魚沼釀人吃海鮮丼',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2 — 田代 / 神立',
      default_city: '苗場 / 湯澤',
      is_ski_day: true,
      default_resort_id: 'yuzawa_kagura',
      item_templates: [
        {
          type: 'transfer',
          title_default: '田代纜車 / 神立接駁',
          time_hint: 'morning',
          note_default: '確認龍纜車或神立接駁巴士時間',
        },
        {
          type: 'ski',
          title_default: '田代・神立自由滑',
          time_hint: 'full_day',
          resort_id: 'yuzawa_kagura',
          suggested_resorts: ['yuzawa_joetsu_kokusai'],
          note_default: '田代粉雪景觀＋神立夜滑，視雪況選擇',
        },
        {
          type: 'note',
          title_default: '退租雪具＋東京市區',
          time_hint: 'evening',
          note_default: '下午返東京，安排銀座/澀谷晚餐與購物',
        },
      ],
    },
    {
      day_index: 4,
      label: '東京市區＆回程',
      default_city: '東京',
      is_ski_day: false,
      item_templates: [
        {
          type: 'note',
          title_default: '東京快閃行程',
          time_hint: 'morning',
          note_default: '推薦 TeamLab Planets、晴空塔或逛表參道',
        },
        {
          type: 'flight',
          title_default: '回程航班',
          time_hint: 'afternoon',
          note_default: '提前 3 小時抵達機場，預留退稅和購物時間',
        },
      ],
    },
  ],
});
