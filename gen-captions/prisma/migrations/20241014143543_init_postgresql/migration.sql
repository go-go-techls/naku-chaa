-- CreateTable
CREATE TABLE "Art" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "feature" TEXT NOT NULL,
    "advantage" TEXT NOT NULL,
    "advice" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Art_pkey" PRIMARY KEY ("id")
);
