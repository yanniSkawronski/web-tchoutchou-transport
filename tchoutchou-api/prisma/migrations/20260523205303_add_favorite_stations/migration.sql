-- CreateTable
CREATE TABLE "FavoriteStation" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "stationId" TEXT NOT NULL,
    "stationName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteStation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FavoriteStation_userId_idx" ON "FavoriteStation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteStation_userId_stationId_key" ON "FavoriteStation"("userId", "stationId");
