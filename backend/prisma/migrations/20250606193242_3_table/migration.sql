/*
  Warnings:

  - You are about to drop the column `hashtags` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `isPosted` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `postedAt` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the column `scheduledAt` on the `Tweet` table. All the data in the column will be lost.
  - You are about to drop the `ViralTweet` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `promptId` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "hashtags",
DROP COLUMN "imageUrl",
DROP COLUMN "isPosted",
DROP COLUMN "postedAt",
DROP COLUMN "scheduledAt",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "posted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promptId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ViralTweet";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessKey" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twitterApiKey" TEXT NOT NULL,
    "twitterApiSecret" TEXT NOT NULL,
    "twitterAccessToken" TEXT NOT NULL,
    "twitterAccessSecret" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prompt" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AccessKey_userId_key" ON "AccessKey"("userId");

-- AddForeignKey
ALTER TABLE "AccessKey" ADD CONSTRAINT "AccessKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
