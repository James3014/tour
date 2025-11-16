import { Template } from '@/lib/types/template';

/**
 * 東北 5 日・3 天滑雪
 *
 * 目標族群：初學～中階、預算與假期有限
 */
export const TOHOKU_5D_TEMPLATE: Template = {
  template_id: 'jp_tohoku_5d3s_v1',
  name: '東北 5 日・3 天滑雪',
  region: 'Japan / Tohoku',
  default_days: 5,
  default_ski_days: 3,
  target_group: '初學～中階、預算與假期有限',
  description: '緊湊的 5 日行程：1 天移動 + 3 天滑雪 + 1 天回程',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達東北',
      default_city: '東北城市',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '請填寫航空公司、航班號、起飛&抵達時間',
        },
        {
          type: 'transfer',
          title_default: '機場 → 住宿',
          time_hint: 'afternoon',
          note_default: '請填寫巴士/自駕資訊：出發時間、上車地點',
        },
        {
          type: 'hotel',
          title_default: '住宿入住',
          time_hint: 'evening',
          note_default: '填寫飯店名稱、地址、check-in 時間',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1',
      default_city: '雪場',
      is_ski_day: true,
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 雪場',
          time_hint: 'morning',
          note_default: '請填寫巴士/自駕資訊：出發時間、上車地點',
        },
        {
          type: 'ski',
          title_default: '滑雪日 1',
          time_hint: 'full_day',
          note_default: '可在備註寫上今天目標',
        },
        {
          type: 'lesson',
          title_default: '初級課程（選填）',
          time_hint: 'morning',
          note_default: '如果有報課程，填寫課程時間、教練聯絡方式',
        },
        {
          type: 'transfer',
          title_default: '雪場 → 住宿',
          time_hint: 'evening',
          note_default: '請填寫返程巴士時間或自駕資訊',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2',
      default_city: '雪場',
      is_ski_day: true,
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 雪場',
          time_hint: 'morning',
          note_default: '請填寫巴士/自駕資訊',
        },
        {
          type: 'ski',
          title_default: '滑雪日 2',
          time_hint: 'full_day',
          note_default: '可在備註寫上今天目標',
        },
        {
          type: 'note',
          title_default: '拍團體照 & 行程調整',
          time_hint: 'afternoon',
          note_default: '安排團體照時間、討論明天行程',
        },
        {
          type: 'transfer',
          title_default: '雪場 → 住宿',
          time_hint: 'evening',
          note_default: '請填寫返程巴士時間',
        },
      ],
    },
    {
      day_index: 4,
      label: '滑雪日 3',
      default_city: '雪場',
      is_ski_day: true,
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 雪場',
          time_hint: 'morning',
          note_default: '請填寫巴士/自駕資訊',
        },
        {
          type: 'ski',
          title_default: '滑雪日 3',
          time_hint: 'full_day',
          note_default: '最後一天，盡情享受！',
        },
        {
          type: 'note',
          title_default: '退租雪具 / 整理行李',
          time_hint: 'afternoon',
          note_default: '提醒當天需要歸還雪具、結清費用、整理行李',
        },
        {
          type: 'transfer',
          title_default: '雪場 → 住宿',
          time_hint: 'evening',
          note_default: '請填寫返程巴士時間',
        },
      ],
    },
    {
      day_index: 5,
      label: '回程',
      default_city: '東北 → 台灣',
      is_ski_day: false,
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 機場',
          time_hint: 'morning',
          note_default: '請填寫前往機場的交通方式',
        },
        {
          type: 'flight',
          title_default: '回程航班',
          time_hint: 'afternoon',
          note_default: '填寫航空公司、航班號、起飛時間',
        },
      ],
    },
  ],
};
