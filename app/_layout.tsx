import LoadingComponent from "@/components/LoadingComponent";
import Status from "@/components/Status";
import { Stack } from "expo-router";
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";

const dbName = "test.db";

export default function RootLayout() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <SQLiteProvider
        databaseName={dbName}
        onInit={migrateDbIfNeeded}
        useSuspense
      >
        <Stack
          screenOptions={{
            headerRight: () => {
              return (
                <Status />
              );
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: "Home",
            }}
          />
          <Stack.Screen
            name="UpdateLocation"
            options={{ title: "Update Location" }}
          />
          <Stack.Screen name="HiveLogger" options={{ title: "Enter Hive" }} />
          <Stack.Screen
            name="CropOpportunities"
            options={{ title: "Crop Opportunities" }}
          />
          <Stack.Screen
            name="HiveHistory"
            options={{ title: "Hive History" }}
          />
        </Stack>
      </SQLiteProvider>
    </Suspense>
  );
}


async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let { user_version: currentDbVersion } = await db.getFirstAsync<{
    user_version: number;
  }>("PRAGMA user_version");

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

      CREATE TABLE UserLocation (
      id INTEGER PRIMARY KEY NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      place_name TEXT NOT NULL
  );
    `);

    // Seed HiveLog with updated date & your location
    await db.runAsync(
      `INSERT INTO HiveLog (hive_id, date_placed, latitude, longitude, num_colonies, is_ready, photo_uri)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "HIVE001",
      "2025-04-12",
      17.4239,
      78.4562,
      12,
      1,
      null
    );

    await db.runAsync(
      `INSERT INTO HiveLog (hive_id, date_placed, latitude, longitude, num_colonies, is_ready, photo_uri)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "HIVE002",
      "2025-04-12",
      17.4239,
      78.4562,
      9,
      0,
      null
    );

    // ✅ Indian Crops (with more entries)
    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP001",
      "Mustard",
      "2025-02-15",
      "2025-03-15",
      17.3949,
      78.4613,
      2.0
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP002",
      "Cotton",
      "2025-06-01",
      "2025-07-15",
      17.3871,
      78.4786,
      2.5
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP003",
      "Sunflower",
      "2025-03-10",
      "2025-04-10",
      17.41,
      78.44,
      1.8
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP004",
      "Safflower",
      "2025-01-20",
      "2025-02-28",
      17.42,
      78.43,
      1.6
    );

    // 🆕 Additional Crops
    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP005",
      "Sesame",
      "2025-07-01",
      "2025-08-15",
      17.46,
      78.48,
      1.4
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP006",
      "Pigeon Pea",
      "2025-08-01",
      "2025-09-20",
      17.47,
      78.49,
      2.2
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP007",
      "Green Gram",
      "2025-03-15",
      "2025-04-30",
      17.43,
      78.46,
      2.1
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP008",
      "Black Gram",
      "2025-07-20",
      "2025-09-05",
      17.44,
      78.47,
      2.0
    );

    await db.runAsync(
      `INSERT INTO Crop (id, name, flowering_start, flowering_end, latitude, longitude, recommended_density)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
      "CROP009",
      "Soybean",
      "2025-07-10",
      "2025-08-25",
      17.45,
      78.475,
      2.3
    );

    await db.runAsync(
      `INSERT INTO AppMeta (key, value)
       VALUES (?, ?)`,
      "has_unsynced_changes",
      "0"
    );

    currentDbVersion = 1;
  }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
