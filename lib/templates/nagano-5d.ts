import { Template } from '@/lib/types/template';

/**
 * 長野 5 日・3 天滑雪（白馬）
 */
export const NAGANO_5D_TEMPLATE: Template = {
  template_id: 'jp_nagano_5d3s_v1',
  name: '長野 5 日・白馬滑雪',
  region: 'Japan / Nagano',
  default_days: 5,
  default_ski_days: 3,
  target_group: '中階～進階、喜歡粉雪',
  description: '前往日本阿爾卑斯山脈，體驗白馬八方尾根的優質粉雪',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達長野',
      default_city: '長野/白馬',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '建議飛東京成田或羽田',
        },
        {
          type: 'transfer',
          title_default: '機場 → 白馬',
          time_hint: 'afternoon',
          note_default: '可搭乘機場巴士直達白馬（約 5-6 小時）或新幹線轉巴士',
        },
        {
          type: 'hotel',
          title_default: '住宿入住',
          time_hint: 'evening',
          note_default: '白馬地區住宿',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1 - 八方尾根',
      default_city: '白馬',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '八方尾根滑雪場',
          time_hint: 'full_day',
          note_default: '1998 年冬奧會場地，適合中高級滑雪者',
        },
        {
          type: 'lesson',
          title_default: '滑雪課程（選填）',
          time_hint: 'morning',
          note_default: '八方提供英文教練',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2 - 栂池高原',
      default_city: '白馬',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '栂池高原滑雪場',
          time_hint: 'full_day',
          note_default: '寬廣緩坡，適合初中級',
        },
      ],
    },
    {
      day_index: 4,
      label: '滑雪日 3 - 白馬五竜',
      default_city: '白馬',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '白馬五竜滑雪場',
          time_hint: 'full_day',
          note_default: '景觀優美，粉雪品質佳',
        },
        {
          type: 'note',
          title_default: '退租雪具',
          time_hint: 'afternoon',
          note_default: '歸還雪具、整理行李',
        },
      ],
    },
    {
      day_index: 5,
      label: '回程',
      default_city: '長野 → 台灣',
      is_ski_day: false,
      item_templates: [
        {
          type: 'transfer',
          title_default: '白馬 → 機場',
          time_hint: 'morning',
          note_default: '預留充足時間返回機場',
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
