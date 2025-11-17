#!/bin/bash

# API 測試腳本
# 用於快速驗證部署後的 API 功能

BASE_URL="${1:-http://localhost:3000}"

echo "🧪 測試 API：$BASE_URL"
echo ""

# 測試 1: 獲取所有模板
echo "📋 測試 1: GET /api/templates"
curl -s "$BASE_URL/api/templates" | head -c 200
echo "..."
echo ""

# 測試 2: 創建 Trip
echo "📋 測試 2: POST /api/trips"
TRIP_RESPONSE=$(curl -s -X POST "$BASE_URL/api/trips" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "jp_hokkaido_6d3s1c_v1",
    "user_id": "test_user_123"
  }')

TRIP_ID=$(echo $TRIP_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ 創建 Trip ID: $TRIP_ID"
echo ""

# 測試 3: 獲取 Trip 詳情
if [ ! -z "$TRIP_ID" ]; then
  echo "📋 測試 3: GET /api/trips/$TRIP_ID"
  curl -s "$BASE_URL/api/trips/$TRIP_ID" | head -c 200
  echo "..."
  echo ""
  echo "✅ 所有測試完成！"
else
  echo "❌ 無法創建 Trip，跳過測試 3"
fi

echo ""
echo "🎉 測試結束"
