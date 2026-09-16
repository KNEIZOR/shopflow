/*
  Warnings:

  - You are about to drop the column `attributeId` on the `ProductAttributeOption` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[productTypeAttributeId,value]` on the table `ProductAttributeOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productTypeAttributeId` to the `ProductAttributeOption` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductAttributeOption" DROP CONSTRAINT "ProductAttributeOption_attributeId_fkey";

-- DropIndex
DROP INDEX "ProductAttributeOption_attributeId_position_idx";

-- DropIndex
DROP INDEX "ProductAttributeOption_attributeId_value_key";

-- AlterTable
ALTER TABLE "ProductAttributeOption" DROP COLUMN "attributeId",
ADD COLUMN     "productAttributeId" TEXT,
ADD COLUMN     "productTypeAttributeId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ProductAttributeOption_productTypeAttributeId_position_idx" ON "ProductAttributeOption"("productTypeAttributeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeOption_productTypeAttributeId_value_key" ON "ProductAttributeOption"("productTypeAttributeId", "value");

-- AddForeignKey
ALTER TABLE "ProductAttributeOption" ADD CONSTRAINT "ProductAttributeOption_productTypeAttributeId_fkey" FOREIGN KEY ("productTypeAttributeId") REFERENCES "ProductTypeAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeOption" ADD CONSTRAINT "ProductAttributeOption_productAttributeId_fkey" FOREIGN KEY ("productAttributeId") REFERENCES "ProductAttribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
