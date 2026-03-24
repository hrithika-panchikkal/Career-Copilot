/*
  Warnings:

  - You are about to drop the column `profile` on the `Analysis` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Analysis` table without a default value. This is not possible if the table is not empty.
*/

-- AlterTable
ALTER TABLE "Analysis"
DROP COLUMN "profile",
ADD COLUMN "userEmail" TEXT;

-- Step 2: assign default email to existing rows
UPDATE "Analysis"
SET "userEmail" = 'legacy-user@example.com'
WHERE "userEmail" IS NULL;

-- Step 3: make column required
ALTER TABLE "Analysis"
ALTER COLUMN "userEmail" SET NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("email")
);

-- CreateIndex
CREATE INDEX "Analysis_userEmail_idx"
ON "Analysis"("userEmail");

-- AddForeignKey
ALTER TABLE "Analysis"
ADD CONSTRAINT "Analysis_userEmail_fkey"
FOREIGN KEY ("userEmail")
REFERENCES "User"("email")
ON DELETE RESTRICT
ON UPDATE CASCADE;