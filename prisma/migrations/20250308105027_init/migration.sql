/*
  Warnings:

  - You are about to drop the column `quntity` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "quntity",
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;
