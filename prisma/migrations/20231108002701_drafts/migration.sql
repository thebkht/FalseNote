-- CreateTable
CREATE TABLE "drafts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "subtitle" VARCHAR(280),
    "cover" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "postId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "readingTime" VARCHAR(250),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updated" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "drafts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "drafts_url_key" ON "drafts"("url");

-- CreateIndex
CREATE INDEX "drafts_createdAt_idx" ON "drafts"("createdAt");

-- AddForeignKey
ALTER TABLE "drafts" ADD CONSTRAINT "drafts_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
