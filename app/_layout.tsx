import LoadingComponent from "@/components/LoadingComponent";
import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";

const dbName = "test.db";

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SQLiteProvider databaseName={dbName} onInit={migrateDbIfNeeded} useSuspense> 
        <Stack />
      </SQLiteProvider>
    </Suspense>
  );
}
async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let { user_version: currentDbVersion } = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE HiveLog (
        id INTEGER PRIMARY KEY NOT NULL,
        hive_id TEXT NOT NULL,
        date_placed TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        num_colonies INTEGER NOT NULL,
        is_ready INTEGER NOT NULL CHECK(is_ready IN (0, 1)),
        photo_uri TEXT
      );

      CREATE TABLE Crop (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        flowering_start TEXT NOT NULL,
        flowering_end TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        recommended_density REAL NOT NULL
      );

      CREATE TABLE AppMeta (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

    // Seed HiveLog
    await db.runAsync(
      `INSERT INTO HiveLog (hive_id, date_placed, latitude, longitude, num_colonies, is_ready, photo_uri)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      'HIVE001', '2025-04-01', 17.4235, 78.4550, 10, 1, null
    );

    await db.runAsync(
      `INSERT INTO HiveLog (hive_id, date_placed, latitude, longitude, num_colonies, is_ready, photo_uri)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      'HIVE002', '2025-04-05', 17.4250, 78.4562, 8, 0, null
    );

    // ✅ Seed ONLY Indian Crops
    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      'CROP001', 'Mustard', '2025-02-15', '2025-03-15', 17.8716, 78.1098, 2.0
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      'CROP002', 'Cotton', '2025-06-01', '2025-07-15', 17.9784, 79.5941, 2.5
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      'CROP003', 'Sunflower', '2025-03-10', '2025-04-10', 18.0456, 78.2606, 1.8
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      'CROP004', 'Safflower', '2025-01-20', '2025-02-28', 18.4386, 79.1288, 1.6
    );

    // Seed AppMeta
    await db.runAsync(
      `INSERT INTO AppMeta (key, value)
       VALUES (?, ?)`,
      'last_sync', '2025-04-11T12:00:00Z'
    );

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

