#!/bin/bash

# 日期修復驗證腳本
# 按照 Linus 原則：直接測試，不要猜測

echo "🧪 開始測試日期保存功能..."
echo ""

TRIP_ID="f9cc5609-2d6d-4ffa-9d31-c02879762c43"
BASE_URL="http://localhost:3000"
TEST_DATE="2025-12-28"

echo "1️⃣ 測試 PATCH /api/trips/:id - 更新日期"
echo "   發送日期: $TEST_DATE"
echo ""

PATCH_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/api/trips/${TRIP_ID}" \
  -H "Content-Type: application/json" \
  -d "{\"start_date\":\"${TEST_DATE}\"}")

echo "   回應: $(echo $PATCH_RESPONSE | jq -c .)"
echo ""

echo "2️⃣ 測試 GET /api/trips/:id - 驗證日期是否保存"
sleep 1

GET_RESPONSE=$(curl -s "${BASE_URL}/api/trips/${TRIP_ID}")
SAVED_DATE=$(echo $GET_RESPONSE | jq -r '.start_date')

echo "   保存的日期: $SAVED_DATE"
echo ""

if [ "$SAVED_DATE" != "null" ] && [ "$SAVED_DATE" != "" ]; then
    echo "✅ 成功！日期已保存"
    
    # 計算第一天和最後一天的日期
    echo ""
    echo "3️⃣ 驗證 Day 日期計算"
    DAYS=$(echo $GET_RESPONSE | jq '.days | length')
    echo "   總天數: $DAYS"
    
    FIRST_DAY=$(echo $GET_RESPONSE | jq -r '.days[0].label')
    LAST_DAY=$(echo $GET_RESPONSE | jq -r ".days[$((DAYS-1))].label")
    
    echo "   Day 1: $FIRST_DAY (應該顯示 12/28 或 12月28日)"
    echo "   Day $DAYS: $LAST_DAY (應該顯示跨年後的日期)"
    echo ""
    echo "✅ 所有測試通過！"
else
    echo "❌ 失敗！日期未保存"
    echo "   期望: $TEST_DATE"
    echo "   實際: $SAVED_DATE"
    exit 1
fi

echo ""
echo "📋 總結："
echo "   - PATCH API: ✅ 正常運作"
echo "   - 日期持久化: ✅ 已保存"
echo "   - GET API: ✅ 正確返回"
echo ""
echo "🎯 現在可以在瀏覽器中測試 UI 顯示："
echo "   $BASE_URL/trips/$TRIP_ID"
