import { Template } from '@/lib/types/template';

/**
 * 北海道 6 日・3 天滑雪 + 1 天市區
 *
 * 目標族群：初學～中階、朋友/家庭小團
 */
export const HOKKAIDO_6D_TEMPLATE: Template = {
  template_id: 'jp_hokkaido_6d3s1c_v1',
  name: '北海道 6 日・3 天滑雪 + 1 天市區',
  region: 'Japan / Hokkaido',
  default_days: 6,
  default_ski_days: 3,
  target_group: '初學～中階、朋友/家庭小團',
  description: '一般台灣自由行揪團，第一次北海道滑雪體驗',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達北海道',
      default_city: '札幌/雪場附近城市',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '請填寫航空公司、航班號、起飛&抵達時間，以及集合時間地點（例如桃園機場第二航廈）',
        },
        {
          type: 'transfer',
          title_default: '機場 → 住宿',
          time_hint: 'afternoon',
          location_hint: '新千歲機場',
          note_default: '請填寫巴士/自駕資訊：出發時間、上車地點、聯絡電話或車牌',
        },
        {
          type: 'hotel',
          title_default: '住宿入住',
          time_hint: 'evening',
          note_default: '填寫飯店名稱、地址、check-in 時間',
        },
        {
          type: 'note',
          title_default: '當地便利商店/晚餐安排',
          time_hint: 'evening',
          note_default: '可備註附近便利商店位置、晚餐餐廳推薦',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1',
      default_city: '某滑雪場',
      is_ski_day: true,
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 雪場',
          time_hint: 'morning',
          note_default: '請填寫巴士/自駕資訊：出發時間、上車地點、聯絡電話或車牌',
        },
        {
          type: 'ski',
          title_default: '滑雪日 1（自由滑＋初階適應）',
          time_hint: 'full_day',
          note_default: '可在備註寫上今天目標：熟悉雪板、練習剎車與轉彎',
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
      default_city: '某滑雪場',
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
          title_default: '滑雪日 2（技巧練習）',
          time_hint: 'full_day',
          note_default: '可在備註寫上今天目標：練習轉彎、提升速度控制',
        },
        {
          type: 'lesson',
          title_default: '進階課程／團體課（選填）',
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
      day_index: 4,
      label: '滑雪日 3',
      default_city: '某滑雪場',
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
          title_default: '滑雪日 3（自由滑＋拍照）',
          time_hint: 'full_day',
          note_default: '最後一天，盡情享受！可安排團體照時間',
        },
        {
          type: 'note',
          title_default: '退租雪具／結清費用',
          time_hint: 'afternoon',
          note_default: '提醒當天需要歸還雪具／結清費用，並預留時間整理行李',
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
      day_index: 5,
      label: '札幌市區＆購物',
      default_city: '札幌',
      is_ski_day: false,
      item_templates: [
        {
          type: 'transfer',
          title_default: '雪場 → 市區（若換住宿）',
          time_hint: 'morning',
          note_default: '如果從雪場移動到市區，填寫交通資訊',
        },
        {
          type: 'hotel',
          title_default: '市區住宿',
          time_hint: 'afternoon',
          note_default: '填寫市區飯店名稱、地址、check-in 時間',
        },
        {
          type: 'note',
          title_default: '市區行程（逛街、美食）',
          time_hint: 'full_day',
          note_default: '可備註想去的景點：狸小路、薄野、貍小路、拉麵橫丁等',
        },
      ],
    },
    {
      day_index: 6,
      label: '回程',
      default_city: '札幌 → 台灣',
      is_ski_day: false,
      item_templates: [
        {
          type: 'transfer',
          title_default: '住宿 → 機場',
          time_hint: 'morning',
          note_default: '請填寫前往機場的交通方式：JR、巴士或計程車',
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
