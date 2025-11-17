import { PackingTemplate, PackingTemplateItem } from '@/lib/types/template';

/**
 * 韓國 4 日滑雪打包清單
 *
 * 設計原則：
 * - 短期行程，精簡版本
 * - 韓國比北海道溫暖，可以減少保暖衣物
 * - 適合輕裝出發
 */
export const KOREA_4D_PACKING: PackingTemplate = {
  template_id: 'kr_yongpyong_4d2s_v1',
  items: [
    // 服裝防寒
    {
      category: 'clothing',
      title: '滑雪外套（防水防風）',
      order: 1,
    },
    {
      category: 'clothing',
      title: '滑雪褲（防水防風）',
      order: 2,
    },
    {
      category: 'clothing',
      title: '保暖內層衣（發熱衣 x2）',
      order: 3,
    },
    {
      category: 'clothing',
      title: '中層保暖衣（刷毛）',
      order: 4,
    },
    {
      category: 'clothing',
      title: '滑雪手套',
      order: 5,
    },
    {
      category: 'clothing',
      title: '毛帽',
      order: 6,
    },
    {
      category: 'clothing',
      title: '脖圍',
      order: 7,
    },
    {
      category: 'clothing',
      title: '滑雪襪（x2 雙）',
      order: 8,
    },
    {
      category: 'clothing',
      title: '保暖褲襪',
      order: 9,
    },
    {
      category: 'clothing',
      title: '換洗衣物（4 天份）',
      order: 10,
    },
    {
      category: 'clothing',
      title: '平時穿著的外套',
      order: 11,
    },

    // 證件金流
    {
      category: 'documents',
      title: '護照',
      order: 20,
    },
    {
      category: 'documents',
      title: '台灣身分證',
      order: 21,
    },
    {
      category: 'documents',
      title: '機票（電子機票或列印）',
      order: 22,
    },
    {
      category: 'documents',
      title: '住宿確認單',
      order: 23,
    },
    {
      category: 'documents',
      title: '保險單',
      order: 24,
    },
    {
      category: 'documents',
      title: '信用卡（2 張）',
      order: 25,
    },
    {
      category: 'documents',
      title: '韓圓現金',
      order: 26,
    },

    // 藥品
    {
      category: 'medicine',
      title: '個人處方藥',
      order: 30,
    },
    {
      category: 'medicine',
      title: '止痛藥',
      order: 31,
    },
    {
      category: 'medicine',
      title: '感冒藥',
      order: 32,
    },
    {
      category: 'medicine',
      title: '腸胃藥',
      order: 33,
    },
    {
      category: 'medicine',
      title: 'OK 繃',
      order: 34,
    },

    // 雪具護具
    {
      category: 'ski_gear',
      title: '雪鏡',
      order: 40,
    },
    {
      category: 'ski_gear',
      title: '防曬乳',
      order: 41,
    },
    {
      category: 'ski_gear',
      title: '護唇膏',
      order: 42,
    },
    {
      category: 'ski_gear',
      title: '護膝/護臀（建議初學者）',
      order: 43,
    },
    {
      category: 'ski_gear',
      title: '暖暖包（5-10 個）',
      order: 44,
    },
    {
      category: 'ski_gear',
      title: '小背包',
      order: 45,
    },
  ],
};
