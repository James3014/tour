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
 *
 * ⚠️ 注意：memoryDB 在服务器重启时会丢失所有数据
 * 生产环境应切换到 prismaDB，需要先：
 * 1. 更新 prisma/schema.prisma 添加缺失欄位
 * 2. 运行 npx prisma migrate dev
 * 3. 实现 lib/db/prisma.ts
 */
export const db = memoryDB;
// export const db = prismaDB;
