-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "aboutHeroUrls" TEXT,
ADD COLUMN     "aboutImageMode" TEXT DEFAULT 'single',
ADD COLUMN     "adminHeroUrls" TEXT,
ADD COLUMN     "adminImageMode" TEXT DEFAULT 'single',
ADD COLUMN     "homeHeroUrls" TEXT,
ADD COLUMN     "homeImageMode" TEXT DEFAULT 'single',
ADD COLUMN     "projectsHeroUrls" TEXT,
ADD COLUMN     "projectsImageMode" TEXT DEFAULT 'single';