/*
  Warnings:

  - Added the required column `updatedAt` to the `GarbageReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GarbageReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "imagePath" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'REPORTED',
    "citizenId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "preferredDate" DATETIME,
    "address" TEXT,
    "notes" TEXT,
    "adminNotes" TEXT,
    "statusHistory" TEXT,
    "assignedWorkerId" INTEGER,
    CONSTRAINT "GarbageReport_citizenId_fkey" FOREIGN KEY ("citizenId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "GarbageReport_assignedWorkerId_fkey" FOREIGN KEY ("assignedWorkerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GarbageReport" ("citizenId", "createdAt", "id", "imagePath", "latitude", "longitude", "status", "updatedAt") SELECT "citizenId", "createdAt", "id", "imagePath", "latitude", "longitude", "status", "createdAt" FROM "GarbageReport";
DROP TABLE "GarbageReport";
ALTER TABLE "new_GarbageReport" RENAME TO "GarbageReport";
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "garbageReportId" INTEGER,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "scheduledTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "workerId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "statusHistory" TEXT,
    "completedAt" DATETIME,
    CONSTRAINT "Task_garbageReportId_fkey" FOREIGN KEY ("garbageReportId") REFERENCES "GarbageReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("createdAt", "garbageReportId", "id", "latitude", "longitude", "scheduledTime", "status", "workerId", "updatedAt") SELECT "createdAt", "garbageReportId", "id", "latitude", "longitude", "scheduledTime", "status", "workerId", "createdAt" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
