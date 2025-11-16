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
  target_group: '初學～中階、預算友善',
  description: '離首爾最近的滑雪場，適合初學者和短期旅行',
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
          note_default: '飛仁川機場',
        },
        {
          type: 'transfer',
          title_default: '首爾 → 龍平',
          time_hint: 'afternoon',
          note_default: '可搭雪場接駁巴士或包車（約 3 小時）',
        },
        {
          type: 'hotel',
          title_default: '龍平度假村',
          time_hint: 'evening',
          note_default: '可入住度假村內酒店',
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
          title_default: '龍平滑雪場',
          time_hint: 'full_day',
          note_default: '2018 平昌冬奧會場地，設施完善',
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
      default_city: '龍平',
      is_ski_day: true,
      item_templates: [
        {
          type: 'ski',
          title_default: '龍平滑雪場',
          time_hint: 'morning',
          note_default: '上午滑雪',
        },
        {
          type: 'note',
          title_default: '退租雪具',
          time_hint: 'afternoon',
          note_default: '歸還雪具、整理行李',
        },
        {
          type: 'transfer',
          title_default: '龍平 → 首爾',
          time_hint: 'afternoon',
          note_default: '返回首爾市區',
        },
        {
          type: 'hotel',
          title_default: '首爾市區住宿',
          time_hint: 'evening',
          note_default: '入住明洞或江南',
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
          note_default: '明洞、弘大、景福宮',
        },
        {
          type: 'transfer',
          title_default: '首爾 → 機場',
          time_hint: 'afternoon',
          note_default: '機場快線 AREX',
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
};
