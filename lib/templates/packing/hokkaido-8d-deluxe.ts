import { PackingTemplate, PackingTemplateItem } from '@/lib/types/template';

/**
 * 北海道 8 日豪華版滑雪打包清單
 *
 * 設計原則：
 * - 進階玩家，可能攜帶自己的雪具
 * - 8 天較長行程，需要更多換洗衣物
 * - 自駕行程，可以多帶一些裝備
 */
export const HOKKAIDO_8D_DELUXE_PACKING: PackingTemplate = {
  template_id: 'jp_hokkaido_8d5s_deluxe_v1',
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
      title: '備用滑雪外套（建議攜帶）',
      order: 3,
    },
    {
      category: 'clothing',
      title: '保暖內層衣（發熱衣 x3-4）',
      order: 4,
    },
    {
      category: 'clothing',
      title: '中層保暖衣（刷毛或羽絨背心 x2）',
      order: 5,
    },
    {
      category: 'clothing',
      title: '滑雪手套（防水保暖 x2 雙）',
      order: 6,
    },
    {
      category: 'clothing',
      title: '毛帽或頭盔內帽',
      order: 7,
    },
    {
      category: 'clothing',
      title: '脖圍或面罩',
      order: 8,
    },
    {
      category: 'clothing',
      title: '滑雪襪（厚底 x3-4 雙）',
      order: 9,
    },
    {
      category: 'clothing',
      title: '保暖褲襪或衛生褲 x2',
      order: 10,
    },
    {
      category: 'clothing',
      title: '雪靴或防水靴',
      order: 11,
    },
    {
      category: 'clothing',
      title: '平時穿著的保暖外套',
      order: 12,
    },
    {
      category: 'clothing',
      title: '換洗衣物（8 天份）',
      order: 13,
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
      title: '台灣駕照',
      order: 22,
    },
    {
      category: 'documents',
      title: '日本駕照譯本',
      order: 23,
    },
    {
      category: 'documents',
      title: '機票（電子機票或列印）',
      order: 24,
    },
    {
      category: 'documents',
      title: '所有住宿確認單',
      order: 25,
    },
    {
      category: 'documents',
      title: '租車確認單',
      order: 26,
    },
    {
      category: 'documents',
      title: '保險單',
      order: 27,
    },
    {
      category: 'documents',
      title: '信用卡（2 張以上）',
      order: 28,
    },
    {
      category: 'documents',
      title: '日圓現金',
      order: 29,
    },
    {
      category: 'documents',
      title: '緊急聯絡資訊',
      order: 30,
    },

    // 藥品
    {
      category: 'medicine',
      title: '個人處方藥',
      order: 35,
    },
    {
      category: 'medicine',
      title: '止痛藥（如普拿疼）',
      order: 36,
    },
    {
      category: 'medicine',
      title: '感冒藥',
      order: 37,
    },
    {
      category: 'medicine',
      title: '腸胃藥',
      order: 38,
    },
    {
      category: 'medicine',
      title: '暈車藥',
      order: 39,
    },
    {
      category: 'medicine',
      title: 'OK 繃與醫療包',
      order: 40,
    },
    {
      category: 'medicine',
      title: '肌肉放鬆貼布',
      order: 41,
    },

    // 雪具護具
    {
      category: 'ski_gear',
      title: '雪鏡（建議 2 副替換）',
      order: 45,
    },
    {
      category: 'ski_gear',
      title: '防曬乳（SPF50+）',
      order: 46,
    },
    {
      category: 'ski_gear',
      title: '護唇膏',
      order: 47,
    },
    {
      category: 'ski_gear',
      title: '護膝/護臀/護腕',
      order: 48,
    },
    {
      category: 'ski_gear',
      title: '頭盔（建議攜帶自己的）',
      order: 49,
    },
    {
      category: 'ski_gear',
      title: '滑雪板/雪板（進階玩家建議攜帶）',
      order: 50,
    },
    {
      category: 'ski_gear',
      title: '滑雪鞋（若攜帶雪板）',
      order: 51,
    },
    {
      category: 'ski_gear',
      title: 'GoPro 或運動相機',
      order: 52,
    },
    {
      category: 'ski_gear',
      title: '暖暖包（建議攜帶 20-30 個）',
      order: 53,
    },
    {
      category: 'ski_gear',
      title: '小背包（滑雪時使用）',
      order: 54,
    },
    {
      category: 'ski_gear',
      title: '雪板蠟與維修工具（若攜帶雪板）',
      order: 55,
    },
  ],
};
