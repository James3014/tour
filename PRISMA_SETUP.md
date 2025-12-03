# Prisma 数据库设置指南

## 当前状态

代码已准备好切换到 Prisma，但目前仍使用内存数据库（MemoryDB）。

## 为什么还在用内存数据库？

沙盒环境无法下载 Prisma 引擎（网络限制）。但代码已经准备好，你可以在本地环境中直接切换。

## 切换步骤

### 1. 初始化 Prisma 数据库

```bash
# 运行数据库迁移
npx prisma migrate dev --name init

# 生成 Prisma 客户端
npx prisma generate
```

### 2. 切换数据库实现

编辑 `lib/db/index.ts`：

```typescript
// 注释掉这行
// export const db = memoryDB;

// 取消注释这行
export const db = prismaDB;
```

### 3. 完成！

现在你的应用使用持久化的 SQLite 数据库。

## 使用 PostgreSQL

如果要使用 PostgreSQL（生产环境推荐）：

### 1. 修改 Prisma Schema

编辑 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"  // 从 sqlite 改为 postgresql
  url      = env("DATABASE_URL")
}
```

### 2. 更新 .env

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/tour_db"
```

### 3. 运行迁移

```bash
npx prisma migrate dev --name switch_to_postgres
```

## 验证切换成功

```bash
# 运行测试
npm test

# 启动开发服务器
npm run dev

# 使用 API 创建一个 trip，然后重启服务器
# 如果数据还在，说明持久化成功
```

## 技术细节

### 数据库抽象层

- `lib/db/interface.ts` - 数据库接口定义
- `lib/db/memory.ts` - 内存数据库实现（当前）
- `lib/db/prisma.ts` - Prisma 数据库实现（已准备好）
- `lib/db/index.ts` - 导出当前使用的数据库

### 为什么要抽象？

**Linus 原则：接口稳定，实现可替换**

- API routes 不关心底层存储
- 可以轻松切换数据库
- 测试时可以用内存数据库（快速）
- 生产时用真实数据库（持久化）

## 故障排查

### Prisma 引擎下载失败

如果遇到 403 Forbidden 错误：

```bash
# 设置环境变量跳过校验和检查
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npx prisma generate
```

### 迁移失败

```bash
# 重置数据库（会删除所有数据！）
npx prisma migrate reset

# 查看当前数据库状态
npx prisma studio

## 雪场资料对齐

- Resort metadata 来源位于 `specs/resort-services/data/*.yaml`，Trip Planner 部署时会优先呼叫 `RESORT_API_BASE_URL` 指向的 resort_api，只有在 API 不可用时才会 fallback 到 `lib/data/resorts.generated.json`。
- 调整 YAML 后请执行 `npm run resorts:generate` 更新 fallback JSON，并把新的 `lib/data/resorts.generated.json` 一起提交，确保 Prisma 验证与前端 UI 都能读取最新雪场清单。
```
