/*
  Warnings:

  - You are about to drop the column `category_order` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `image_uri` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `image_uri` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `from_user_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `request_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `image_uri` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `price_range` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `product_image_urls` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `custom_specs` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fromUserId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_from_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_request_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_material_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Request" DROP CONSTRAINT "Request_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Request" DROP CONSTRAINT "Request_user_id_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "category_order",
DROP COLUMN "created_at",
DROP COLUMN "image_uri",
DROP COLUMN "is_active",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryOrder" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUri" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "created_at",
DROP COLUMN "image_uri",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUri" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "created_at",
DROP COLUMN "from_user_id",
DROP COLUMN "request_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fromUserId" TEXT NOT NULL,
ADD COLUMN     "requestId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "image_uri",
DROP COLUMN "material_id",
DROP COLUMN "price_range",
DROP COLUMN "product_image_urls",
DROP COLUMN "updated_at",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageUri" TEXT,
ADD COLUMN     "materialId" TEXT,
ADD COLUMN     "priceRange" TEXT,
ADD COLUMN     "productImageUrls" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "created_at",
DROP COLUMN "custom_specs",
DROP COLUMN "product_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customSpecs" JSONB,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password_hash",
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
