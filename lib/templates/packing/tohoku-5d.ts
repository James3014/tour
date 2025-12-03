import { PackingTemplate } from '@/lib/types/template';
import { definePacking } from '../schema';

/**
 * 東北 5 日（安比 + 藏王）打包清單
 */
export const TOHOKU_5D_PACKING: PackingTemplate = definePacking({
  template_id: 'jp_tohoku_5d3s_v1',
  items: [
    // 服裝防寒
    { category: 'clothing', title: '極寒等級滑雪外套、褲（-15°C 專用）', order: 1 },
    { category: 'clothing', title: '高機能保暖底層（羊毛或發熱衣）', order: 2 },
    { category: 'clothing', title: '厚中層：羽絨 / PrimaLoft', order: 3 },
    { category: 'clothing', title: '面罩、Balaclava、厚毛帽', order: 4 },
    { category: 'clothing', title: '多副手套（濕雪備用）', order: 5 },
    { category: 'clothing', title: '溫泉服與旅館室內服', order: 6 },

    // 證件金流
    { category: 'documents', title: '護照、身分證、保險、國際駕照（如租車）', order: 20 },
    { category: 'documents', title: '國內線 / 新幹線票券與住宿憑證', order: 21 },
    { category: 'documents', title: '雪場課程、CAT、樹冰夜間票', order: 22 },
    { category: 'documents', title: '交通卡 / 現金（山形/岩手小店多現金）', order: 23 },

    // 藥品
    { category: 'medicine', title: '個人藥品、止痛藥、肌肉放鬆貼布', order: 30 },
    { category: 'medicine', title: '保濕用品、護唇膏、防凍霜', order: 31 },
    { category: 'medicine', title: '暈車藥與腸胃藥（長途巴士備用）', order: 32 },

    // 雪具護具
    { category: 'ski_gear', title: '護具（護背/護臀）與 avalanche 需求（如野雪）', order: 40 },
    { category: 'ski_gear', title: '雪鏡（低光線 + 夜間）、防霧劑', order: 41 },
    { category: 'ski_gear', title: '頭盔、雪板、雪鞋（或預約租借）', order: 42 },
    { category: 'ski_gear', title: '暖暖包、行動電源、防水手機袋', order: 43 },
    { category: 'ski_gear', title: '保溫瓶、能量膠、GoPro/相機', order: 44 },
  ],
});
