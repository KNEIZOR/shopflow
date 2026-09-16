-- CreateEnum
CREATE TYPE "ProductAttributeType" AS ENUM ('TEXT', 'NUMBER', 'BOOLEAN', 'SELECT');

-- CreateEnum
CREATE TYPE "ProductAttributeScope" AS ENUM ('PRODUCT', 'VARIANT', 'BOTH');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "productTypeId" TEXT;

-- CreateTable
CREATE TABLE "ProductType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttribute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type" "ProductAttributeType" NOT NULL,
    "scope" "ProductAttributeScope" NOT NULL DEFAULT 'PRODUCT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTypeAttribute" (
    "id" TEXT NOT NULL,
    "productTypeId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductTypeAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttributeOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "attributeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAttributeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttributeValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "productId" TEXT,
    "variantId" TEXT,
    "attributeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductAttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductType_slug_key" ON "ProductType"("slug");

-- CreateIndex
CREATE INDEX "ProductType_name_idx" ON "ProductType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_slug_key" ON "ProductAttribute"("slug");

-- CreateIndex
CREATE INDEX "ProductAttribute_name_idx" ON "ProductAttribute"("name");

-- CreateIndex
CREATE INDEX "ProductAttribute_type_idx" ON "ProductAttribute"("type");

-- CreateIndex
CREATE INDEX "ProductAttribute_scope_idx" ON "ProductAttribute"("scope");

-- CreateIndex
CREATE INDEX "ProductTypeAttribute_productTypeId_position_idx" ON "ProductTypeAttribute"("productTypeId", "position");

-- CreateIndex
CREATE INDEX "ProductTypeAttribute_attributeId_idx" ON "ProductTypeAttribute"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTypeAttribute_productTypeId_attributeId_key" ON "ProductTypeAttribute"("productTypeId", "attributeId");

-- CreateIndex
CREATE INDEX "ProductAttributeOption_attributeId_position_idx" ON "ProductAttributeOption"("attributeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeOption_attributeId_value_key" ON "ProductAttributeOption"("attributeId", "value");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_productId_idx" ON "ProductAttributeValue"("productId");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_variantId_idx" ON "ProductAttributeValue"("variantId");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_attributeId_idx" ON "ProductAttributeValue"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeValue_productId_attributeId_key" ON "ProductAttributeValue"("productId", "attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeValue_variantId_attributeId_key" ON "ProductAttributeValue"("variantId", "attributeId");

-- CreateIndex
CREATE INDEX "Product_productTypeId_idx" ON "Product"("productTypeId");

-- AddForeignKey
ALTER TABLE "ProductTypeAttribute" ADD CONSTRAINT "ProductTypeAttribute_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTypeAttribute" ADD CONSTRAINT "ProductTypeAttribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "ProductAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeOption" ADD CONSTRAINT "ProductAttributeOption_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "ProductAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "ProductAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "ProductType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
