import { Template } from '@/lib/types/template';

/**
 * 韓國 4 日・2 天滑雪（龍平/鳳凰城）
 */
export const KOREA_4D_TEMPLATE: Template = {
  template_id: 'kr_yongpyong_4d2s_v1',
  name: '韓國 4 日・龍平滑雪',
  region: 'Korea / Gangwon',
  default_days: 4,
  default_ski_days: 2,
  target_group: '初學～中階、2-4 人小團',
  description: '預算友好的短期滑雪，離台灣近、飛行時間短，適合第一次滑雪',
  day_templates: [
    {
      day_index: 1,
      label: '出發＆抵達韓國',
      default_city: '首爾',
      is_ski_day: false,
      item_templates: [
        {
          type: 'flight',
          title_default: '去程航班',
          time_hint: 'morning',
          note_default: '請填寫航空公司、航班號、起飛時間、抵達時間，以及集合地點（例如：桃園機場第二航廈）',
        },
        {
          type: 'transfer',
          title_default: '首爾 → 龍平',
          time_hint: 'afternoon',
          note_default: '請填寫交通方式（巴士/自駕/JR）、出發時間、上車地點，以及聯絡電話或車牌（若有）',
        },
        {
          type: 'hotel',
          title_default: '龍平度假村',
          time_hint: 'evening',
          note_default: '請填寫飯店名稱、地址、check-in 時間',
        },
      ],
    },
    {
      day_index: 2,
      label: '滑雪日 1',
      default_city: '龍平',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '龍平滑雪場（全天）',
          time_hint: 'full_day',
          note_default: '可在備註寫上今天目標：熟悉雪板、練習剎車與轉彎（2018 平昌冬奧會場地，設施完善）',
        },
        {
          type: 'lesson',
          title_default: '滑雪課程（選填）',
          time_hint: 'morning',
          note_default: '請填寫課程時間、教練姓名、聯絡方式',
        },
      ],
    },
    {
      day_index: 3,
      label: '滑雪日 2',
      default_city: '龍平',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '龍平滑雪場（半天）',
          time_hint: 'morning',
          note_default: '可在備註寫上今天目標：練習轉彎、提升速度控制',
        },
        {
          type: 'note',
          title_default: '退租雪具／結清費用',
          time_hint: 'afternoon',
          note_default: '提醒當天需要歸還雪具／結清費用，並預留時間整理行李',
        },
        {
          type: 'transfer',
          title_default: '龍平 → 首爾',
          time_hint: 'afternoon',
          note_default: '請填寫交通方式（巴士/自駕/JR）、出發時間、上車地點，以及聯絡電話或車牌（若有）',
        },
        {
          type: 'hotel',
          title_default: '首爾市區住宿',
          time_hint: 'evening',
          note_default: '請填寫飯店名稱、地址、check-in 時間',
        },
      ],
    },
    {
      day_index: 4,
      label: '首爾市區＆回程',
      default_city: '首爾',
      is_ski_day: false,
      item_templates: [
        {
          type: 'note',
          title_default: '首爾觀光購物',
          time_hint: 'morning',
          note_default: '可備註想去的景點：明洞、弘大、景福宮、東大門等',
        },
        {
          type: 'transfer',
          title_default: '首爾 → 機場',
          time_hint: 'afternoon',
          note_default: '請填寫交通方式（巴士/自駕/JR）、出發時間、上車地點，以及聯絡電話或車牌（若有）',
        },
        {
          type: 'flight',
          title_default: '回程航班',
          time_hint: 'evening',
          note_default: '請填寫航空公司、航班號、起飛時間、抵達時間',
        },
      ],
    },
  ],
};
