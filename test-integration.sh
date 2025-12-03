#!/bin/bash

echo "=== Trip Planner 整合狀態檢查 ==="
echo ""

# 檢查環境變數
echo "📋 環境變數配置："
echo "---"
if [ -f .env ]; then
  echo "✅ .env 檔案存在"
  echo ""
  echo "當前配置："
  cat .env
  echo ""
  
  # 檢查必要的外部服務 URL
  if grep -q "RESORT_API_URL" .env; then
    echo "✅ RESORT_API_URL 已配置"
  else
    echo "⚠️  RESORT_API_URL 未配置（resort 整合將無法運作）"
  fi
  
  if grep -q "USER_CORE_API_URL" .env; then
    echo "✅ USER_CORE_API_URL 已配置"
  else
    echo "⚠️  USER_CORE_API_URL 未配置（user-core 同步將無法運作）"
  fi
  
  if grep -q "SNOWBUDDY_API_URL" .env; then
    echo "✅ SNOWBUDDY_API_URL 已配置"
  else
    echo "⚠️  SNOWBUDDY_API_URL 未配置（雪友推薦將無法運作）"
  fi
else
  echo "❌ .env 檔案不存在"
fi

echo ""
echo "---"
echo ""

# 檢查資料庫
echo "🗄️  資料庫狀態："
echo "---"
if [ -f prisma/dev.db ]; then
  echo "✅ SQLite 資料庫存在"
  echo "檔案大小: $(ls -lh prisma/dev.db | awk '{print $5}')"
else
  echo "⚠️  資料庫檔案不存在，需要執行 prisma db push"
fi

echo ""
echo "---"
echo ""

# 檢查關鍵檔案
echo "📁 關鍵整合檔案："
echo "---"

files=(
  "lib/external/resort-client.ts"
  "lib/external/user-core-client.ts"
  "lib/external/snowbuddy-client.ts"
  "app/api/matching/recommendations/route.ts"
  "app/api/resorts/route.ts"
  "app/trips/[id]/components/TripHeader.tsx"
  "components/ResortSearchInput.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (缺失)"
  fi
done

echo ""
echo "---"
echo ""

# 檢查 node_modules
echo "📦 依賴安裝："
echo "---"
if [ -d node_modules ]; then
  echo "✅ node_modules 存在"
  if [ -f node_modules/.prisma/client/index.js ]; then
    echo "✅ Prisma Client 已生成"
  else
    echo "⚠️  Prisma Client 未生成，需要執行 npm run db:generate"
  fi
else
  echo "❌ node_modules 不存在，需要執行 npm install"
fi

echo ""
echo "---"
echo ""

# 檢查 TypeScript 編譯
echo "🔧 TypeScript 檢查："
echo "---"
if command -v npx &> /dev/null; then
  echo "執行 TypeScript 類型檢查..."
  npx tsc --noEmit 2>&1 | head -20
  if [ $? -eq 0 ]; then
    echo "✅ 無 TypeScript 錯誤"
  else
    echo "⚠️  發現 TypeScript 錯誤（僅顯示前 20 行）"
  fi
else
  echo "⚠️  npx 不可用，跳過 TypeScript 檢查"
fi

echo ""
echo "---"
echo ""

echo "✨ 檢查完成！"
echo ""
echo "💡 建議下一步："
echo "1. 補齊 .env 中的外部服務 URL"
echo "2. 執行 npm run dev 啟動開發伺服器"
echo "3. 訪問 http://localhost:3000 測試功能"
echo "4. 檢查瀏覽器 Console 和 Network 面板確認 API 呼叫"
