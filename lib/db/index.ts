/**
 * 数据库导出
 *
 * 切换数据库实现：
 * - 开发/测试: 使用 memory（快速，无需配置）
 * - 生产环境: 使用 prismaDB（持久化存储）
 *
 * 使用方法：
 * 1. 运行 `npx prisma migrate dev` 初始化数据库
 * 2. 取消注释下面的 prismaDB 导出
 */

import { db as memoryDB } from './memory';
import { prismaDB } from './prisma';

/**
 * 当前使用的数据库
 *
 * ✅ 生产环境：prismaDB（持久化存储）
 * 🔧 开发环境：可切换到 memoryDB（快速测试）
 * 
 * 重構中：暫時使用 memoryDB 測試新功能
 */
// export const db = prismaDB;
export const db = memoryDB;  // 重構中：使用 MemoryDB 測試
