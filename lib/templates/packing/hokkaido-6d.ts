import { PackingTemplate, PackingTemplateItem } from '@/lib/types/template';
import { definePacking } from '../schema';

/**
 * 北海道 6 日滑雪打包清單
 *
 * 設計原則：
 * - 分類清楚（服裝、證件、藥品、雪具）
 * - 初學者友善，不假設有自己的雪具
 * - 北海道極寒，強調保暖
 */
export const HOKKAIDO_6D_PACKING: PackingTemplate = definePacking({
  template_id: 'jp_hokkaido_6d3s1c_v1',
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
      title: '保暖內層衣（發熱衣 x2-3）',
      order: 3,
    },
    {
      category: 'clothing',
      title: '中層保暖衣（刷毛或羽絨背心）',
      order: 4,
    },
    {
      category: 'clothing',
      title: '滑雪手套（防水保暖）',
      order: 5,
    },
    {
      category: 'clothing',
      title: '毛帽或頭盔內帽',
      order: 6,
    },
    {
      category: 'clothing',
      title: '脖圍或面罩',
      order: 7,
    },
    {
      category: 'clothing',
      title: '滑雪襪（厚底 x2-3 雙）',
      order: 8,
    },
    {
      category: 'clothing',
      title: '保暖褲襪或衛生褲',
      order: 9,
    },
    {
      category: 'clothing',
      title: '雪靴或防水靴',
      order: 10,
    },
    {
      category: 'clothing',
      title: '平時穿著的保暖外套',
      order: 11,
    },
    {
      category: 'clothing',
      title: '換洗衣物（6 天份）',
      order: 12,
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
      title: '信用卡（2 張以上）',
      order: 25,
    },
    {
      category: 'documents',
      title: '日圓現金',
      order: 26,
    },
    {
      category: 'documents',
      title: '租車確認單（若有自駕）',
      order: 27,
    },
    {
      category: 'documents',
      title: '緊急聯絡資訊',
      order: 28,
    },

    // 藥品
    {
      category: 'medicine',
      title: '個人處方藥',
      order: 30,
    },
    {
      category: 'medicine',
      title: '止痛藥（如普拿疼）',
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
      title: '暈車藥（若容易暈車）',
      order: 34,
    },
    {
      category: 'medicine',
      title: 'OK 繃與簡易醫療包',
      order: 35,
    },

    // 雪具護具
    {
      category: 'ski_gear',
      title: '雪鏡（建議 2 副替換）',
      order: 40,
    },
    {
      category: 'ski_gear',
      title: '防曬乳（SPF50+）',
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
      title: '頭盔（可雪場租借）',
      order: 44,
    },
    {
      category: 'ski_gear',
      title: '滑雪板/雪板（可雪場租借）',
      order: 45,
    },
    {
      category: 'ski_gear',
      title: '暖暖包（建議攜帶 10-20 個）',
      order: 46,
    },
    {
      category: 'ski_gear',
      title: '小背包（滑雪時裝水與零食）',
      order: 47,
    },
  ],
});
