import { PackingTemplate } from '@/lib/types/template';
import { definePacking } from '../schema';

/**
 * 新潟 4 日（苗場）打包清單
 */
export const NIIGATA_4D_PACKING: PackingTemplate = definePacking({
  template_id: 'jp_niigata_4d2s_v1',
  items: [
    // 服裝防寒
    { category: 'clothing', title: '防水滑雪外套/褲，適合濕雪', order: 1 },
    { category: 'clothing', title: '快乾內層與厚襪（2-3 套）', order: 2 },
    { category: 'clothing', title: '保暖帽、頸套、觸控手套', order: 3 },
    { category: 'clothing', title: '休閒裝：東京市區穿搭', order: 4 },
    { category: 'clothing', title: '旅館/溫泉輕便衣物', order: 5 },

    // 證件金流
    { category: 'documents', title: '護照、身分證、保險、信用卡', order: 20 },
    { category: 'documents', title: '機票與上越新幹線車票', order: 21 },
    { category: 'documents', title: '住宿/纜車/課程預約確認', order: 22 },
    { category: 'documents', title: 'Suica / 現金（湯澤餐飲多用現金）', order: 23 },

    // 藥品
    { category: 'medicine', title: '暈車藥（山路巴士）、腸胃藥', order: 30 },
    { category: 'medicine', title: '個人處方藥、OK 繃、肌貼', order: 31 },
    { category: 'medicine', title: '護唇膏、防曬、保濕乳', order: 32 },

    // 雪具護具
    { category: 'ski_gear', title: '雪鏡（含濕雪專用防霧劑）', order: 40 },
    { category: 'ski_gear', title: '護具（護膝/護臀）與暖暖包', order: 41 },
    { category: 'ski_gear', title: '頭盔、雪鞋、雪板（或確認租借）', order: 42 },
    { category: 'ski_gear', title: '行動電源、防水手機袋、自拍棒', order: 43 },
    { category: 'ski_gear', title: '小背包、保溫瓶、補給零食', order: 44 },
  ],
});
