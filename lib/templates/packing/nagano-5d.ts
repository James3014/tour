import { PackingTemplate } from '@/lib/types/template';
import { definePacking } from '../schema';

/**
 * 長野 5 日（白馬）打包清單
 */
export const NAGANO_5D_PACKING: PackingTemplate = definePacking({
  template_id: 'jp_nagano_5d3s_v1',
  items: [
    // 服裝防寒
    { category: 'clothing', title: '防水滑雪外套 / 褲', order: 1 },
    { category: 'clothing', title: '發熱衣與吸濕排汗底層（3-4 套）', order: 2 },
    { category: 'clothing', title: '中層：抓絨或輕量羽絨', order: 3 },
    { category: 'clothing', title: '保暖帽、脖圍、面罩', order: 4 },
    { category: 'clothing', title: '滑雪手套 + 內裡手套', order: 5 },
    { category: 'clothing', title: '雪地靴 / 防水鞋', order: 6 },
    { category: 'clothing', title: '休閒服與溫泉可穿的簡單衣物', order: 7 },

    // 證件金流
    { category: 'documents', title: '護照、身分證、國際駕照（若自駕）', order: 20 },
    { category: 'documents', title: '機票 / 新幹線 / 巴士預約憑證', order: 21 },
    { category: 'documents', title: '住宿確認信與雪場課程預約', order: 22 },
    { category: 'documents', title: '保險單（含滑雪）', order: 23 },
    { category: 'documents', title: '信用卡 + 日圓現金（小店多現金）', order: 24 },

    // 藥品
    { category: 'medicine', title: '個人常備藥、肌膜貼、酸痛貼', order: 30 },
    { category: 'medicine', title: '腸胃藥、止痛藥、暈車藥', order: 31 },
    { category: 'medicine', title: '過敏藥、喉糖、防乾裂護唇膏', order: 32 },

    // 雪具護具
    { category: 'ski_gear', title: '護具：護膝、護臀、護腕（白馬地形多變）', order: 40 },
    { category: 'ski_gear', title: '雪鏡（建議亮面 + 夜間各一）', order: 41 },
    { category: 'ski_gear', title: '頭盔、雪板/雪鞋（無則預約租借）', order: 42 },
    { category: 'ski_gear', title: '防曬乳 SPF50+、暖暖包、保溫瓶', order: 43 },
    { category: 'ski_gear', title: '小背包（裝水、零食、GoPro）', order: 44 },
  ],
});
