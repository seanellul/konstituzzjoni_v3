-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,
    "referrer" TEXT,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleView" (
    "id" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "article" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,

    CONSTRAINT "ArticleView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterView" (
    "id" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,

    CONSTRAINT "ChapterView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SearchQuery" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,

    CONSTRAINT "SearchQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveUser" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActiveUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsSummary" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "totalPageViews" INTEGER NOT NULL DEFAULT 0,
    "totalArticleViews" INTEGER NOT NULL DEFAULT 0,
    "totalChapterViews" INTEGER NOT NULL DEFAULT 0,
    "totalSearches" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnalyticsSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_timestamp_idx" ON "PageView"("timestamp");

-- CreateIndex
CREATE INDEX "PageView_path_idx" ON "PageView"("path");

-- CreateIndex
CREATE INDEX "ArticleView_timestamp_idx" ON "ArticleView"("timestamp");

-- CreateIndex
CREATE INDEX "ArticleView_chapter_article_idx" ON "ArticleView"("chapter", "article");

-- CreateIndex
CREATE INDEX "ChapterView_timestamp_idx" ON "ChapterView"("timestamp");

-- CreateIndex
CREATE INDEX "ChapterView_chapter_idx" ON "ChapterView"("chapter");

-- CreateIndex
CREATE INDEX "SearchQuery_timestamp_idx" ON "SearchQuery"("timestamp");

-- CreateIndex
CREATE INDEX "SearchQuery_term_idx" ON "SearchQuery"("term");

-- CreateIndex
CREATE UNIQUE INDEX "ActiveUser_sessionId_key" ON "ActiveUser"("sessionId");

-- CreateIndex
CREATE INDEX "ActiveUser_lastActive_idx" ON "ActiveUser"("lastActive");

-- CreateIndex
CREATE UNIQUE INDEX "AnalyticsSummary_date_key" ON "AnalyticsSummary"("date");
