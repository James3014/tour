import { Template } from '@/lib/types/template';

/**
 * 新潟 4 日・2 天滑雪（苗場）
 */
export const NIIGATA_4D_TEMPLATE: Template = {
  template_id: 'jp_niigata_4d2s_v1',
  name: '新潟 4 日・苗場快閃',
  region: 'Japan / Niigata',
  default_days: 4,
  default_ski_days: 2,
  target_group: '初學～中階、週末滑雪',
  description: '離東京最近的滑雪勝地，適合短期滑雪之旅',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達苗場',
      default_city: '苗場',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '飛東京成田或羽田',
        },
        {
          type: 'transfer',
          title_default: '東京 → 苗場',
          time_hint: 'afternoon',
          location_hint: '新幹線至越後湯澤站',
          note_default: '可搭新幹線至越後湯澤，再轉接駁巴士（約 2 小時）',
        },
        {
          type: 'hotel',
          title_default: '苗場王子飯店',
          time_hint: 'evening',
          note_default: 'Ski-in/Ski-out 便利住宿',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1',
      default_city: '苗場',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '苗場滑雪場',
          time_hint: 'full_day',
          note_default: '適合各級別，可體驗世界最長纜車「龍纜車」前往田代',
        },
        {
          type: 'lesson',
          title_default: '滑雪課程（選填）',
          time_hint: 'morning',
          note_default: '中文教練可預約',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2',
      default_city: '苗場',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '苗場 / 田代滑雪場',
          time_hint: 'full_day',
          note_default: '搭龍纜車前往田代區域',
        },
        {
          type: 'note',
          title_default: '退租雪具 + 東京住宿',
          time_hint: 'evening',
          note_default: '下午返回東京，晚上可逛街購物',
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
          title_default: '東京市區觀光',
          time_hint: 'morning',
          note_default: '淺草、晴空塔、新宿等',
        },
        {
          type: 'flight',
          title_default: '回程航班',
          time_hint: 'afternoon',
          note_default: '從東京返台',
        },
      ],
    },
  ],
};
