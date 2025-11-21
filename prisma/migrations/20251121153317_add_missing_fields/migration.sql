-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "template_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" DATETIME,
    "people_count" INTEGER,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Day" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "day_index" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "city" TEXT,
    "is_ski_day" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Day_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trip" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" DATETIME,
    "time" TEXT,
    "time_hint" TEXT,
    "location" TEXT,
    "link" TEXT,
    "note" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Item_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "Day" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "PackingItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trip_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "Trip_user_id_idx" ON "Trip"("user_id");

-- CreateIndex
CREATE INDEX "Trip_template_id_idx" ON "Trip"("template_id");

-- CreateIndex
CREATE INDEX "Day_trip_id_idx" ON "Day"("trip_id");

-- CreateIndex
CREATE UNIQUE INDEX "Day_trip_id_day_index_key" ON "Day"("trip_id", "day_index");

-- CreateIndex
CREATE INDEX "Item_day_id_idx" ON "Item"("day_id");

-- CreateIndex
CREATE INDEX "ChecklistItem_trip_id_idx" ON "ChecklistItem"("trip_id");

-- CreateIndex
CREATE INDEX "PackingItem_trip_id_idx" ON "PackingItem"("trip_id");
