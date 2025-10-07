-- Add USER role to enum
ALTER TYPE "Role" ADD VALUE 'USER';

-- Add featured column to Post table
ALTER TABLE "Post" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;

-- Create Page table
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- Create Settings table
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "homeHeroUrl" TEXT,
    "homeIntro" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- Create unique index for Page slug
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- Insert default settings record
INSERT INTO "Settings" ("id", "updatedAt") VALUES (1, CURRENT_TIMESTAMP);

-- Insert default pages
INSERT INTO "Page" ("id", "slug", "title", "content", "updatedAt", "createdAt") VALUES 
(gen_random_uuid(), 'about', 'About', '<p>Welcome to my portfolio. This page is editable by admins.</p>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'links', 'Links', '<p>Find me on various platforms. This page is editable by admins.</p>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);