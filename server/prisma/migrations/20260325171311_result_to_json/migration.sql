-- Step 1: create a temporary column
ALTER TABLE "Analysis"
ADD COLUMN "result_temp" JSONB;

-- Step 2: convert existing string → JSON
UPDATE "Analysis"
SET "result_temp" = result::jsonb;

-- Step 3: drop old column
ALTER TABLE "Analysis"
DROP COLUMN "result";

-- Step 4: rename new column
ALTER TABLE "Analysis"
RENAME COLUMN "result_temp" TO "result";

-- Step 5: make it required
ALTER TABLE "Analysis"
ALTER COLUMN "result" SET NOT NULL;