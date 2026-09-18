/*
  Warnings:

  - You are about to drop the column `productAttributeId` on the `ProductAttributeOption` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductAttributeOption" DROP CONSTRAINT "ProductAttributeOption_productAttributeId_fkey";

-- AlterTable
ALTER TABLE "ProductAttributeOption" DROP COLUMN "productAttributeId";
