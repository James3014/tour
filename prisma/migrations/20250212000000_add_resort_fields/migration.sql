-- Add resort metadata columns to Day
ALTER TABLE "Day"
ADD COLUMN "resort_id" TEXT,
ADD COLUMN "resort_name" TEXT,
ADD COLUMN "region" TEXT;

-- Add resort metadata columns to Item
ALTER TABLE "Item"
ADD COLUMN "resort_id" TEXT,
ADD COLUMN "resort_name" TEXT,
ADD COLUMN "region" TEXT;
