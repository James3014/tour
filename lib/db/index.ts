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
// import { prismaDB } from './prisma';

/**
 * 当前使用的数据库
 * 要切换到 Prisma，请注释掉 memoryDB 并取消注释 prismaDB
 */
export const db = memoryDB;
// export const db = prismaDB;
