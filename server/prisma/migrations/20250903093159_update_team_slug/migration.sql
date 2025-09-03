/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Made the column `slug` on table `Team` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Team" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Team_slug_key" ON "public"."Team"("slug");
