#!/bin/bash

echo "=== Trip Planner 本地測試環境設置 ==="
echo ""

# 檢查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安裝，請先安裝 Docker"
    echo "   https://www.docker.com/products/docker-desktop"
    exit 1
fi

echo "✅ Docker 已安裝"
echo ""

# 檢查 PostgreSQL 容器是否運行
if docker ps | grep -q "postgres.*5432"; then
    echo "✅ PostgreSQL 容器已運行"
else
    echo "🚀 啟動 PostgreSQL 容器..."
    docker run -d \
        --name tour-postgres \
        -p 5432:5432 \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=tour_dev \
        postgres:15-alpine
    
    if [ $? -eq 0 ]; then
        echo "✅ PostgreSQL 容器已啟動"
        echo "   等待資料庫就緒..."
        sleep 3
    else
        echo "⚠️  容器可能已存在，嘗試啟動..."
        docker start tour-postgres
    fi
fi

echo ""

# 創建 .env.local
if [ ! -f .env.local ]; then
    echo "📝 創建 .env.local..."
    cat > .env.local << 'EOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tour_dev"

# 外部服務（可選，留空則優雅降級）
RESORT_API_URL=
USER_CORE_API_URL=
SNOWBUDDY_API_URL=
EOF
    echo "✅ .env.local 已創建"
else
    echo "✅ .env.local 已存在"
fi

echo ""

# 安裝依賴
if [ ! -d node_modules ]; then
    echo "📦 安裝依賴..."
    npm install
fi

echo ""

# 生成 Prisma Client
echo "🔧 生成 Prisma Client..."
npm run db:generate

echo ""

# 推送資料庫 schema
echo "🗄️  推送資料庫 schema..."
npm run db:push

echo ""
echo "✨ 設置完成！"
echo ""
echo "💡 下一步："
echo "   1. 執行 'npm run dev' 啟動開發伺服器"
echo "   2. 訪問 http://localhost:3000"
echo "   3. 測試功能"
echo ""
echo "🛑 停止 PostgreSQL:"
echo "   docker stop tour-postgres"
echo ""
echo "🗑️  移除 PostgreSQL 容器:"
echo "   docker rm tour-postgres"
