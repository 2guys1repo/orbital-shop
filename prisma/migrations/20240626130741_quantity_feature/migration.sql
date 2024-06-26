-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('BASIC', 'MIDDLEMAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "SellerType" AS ENUM ('NEW', 'EXPERIENCED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SHIPPED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "kindeId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'BASIC',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerDetails" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "purchaseCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BuyerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerDetails" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "saleCount" INTEGER NOT NULL DEFAULT 0,
    "sellerType" "SellerType" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "SellerDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imagePath" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MiddlemanDetails" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "ordersProcessed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MiddlemanDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "buyerId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "middlemanId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "priceSold" DOUBLE PRECISION NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_kindeId_key" ON "User"("kindeId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerDetails_userId_key" ON "BuyerDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerDetails_userId_key" ON "SellerDetails"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MiddlemanDetails_userId_key" ON "MiddlemanDetails"("userId");

-- AddForeignKey
ALTER TABLE "BuyerDetails" ADD CONSTRAINT "BuyerDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("kindeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerDetails" ADD CONSTRAINT "SellerDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("kindeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerDetails"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiddlemanDetails" ADD CONSTRAINT "MiddlemanDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("kindeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_middlemanId_fkey" FOREIGN KEY ("middlemanId") REFERENCES "MiddlemanDetails"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "BuyerDetails"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "SellerDetails"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
