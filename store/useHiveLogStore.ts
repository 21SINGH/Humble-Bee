import { create } from "zustand";
import { SQLiteDatabase } from "expo-sqlite";
import { HiveLog } from "../types";

interface HiveLogStore {
  hiveLogs: HiveLog[];
  fetchHiveLogs: (db: SQLiteDatabase) => Promise<void>;
  addHiveLog: (db: SQLiteDatabase, log: HiveLog) => Promise<void>;
  deleteHiveLog: (db: SQLiteDatabase, id: number) => Promise<void>;
}

export const useHiveLogStore = create<HiveLogStore>()((set) => ({
  hiveLogs: [],
  fetchHiveLogs: async (db) => {
    const result = await db.getAllAsync<HiveLog>(
      "SELECT * FROM HiveLogs ORDER BY date_placed DESC"
    );
    set({ hiveLogs: result });
  },
  addHiveLog: async (db, log) => {
    await db.runAsync(
      `INSERT INTO HiveLogs (hive_id, date_placed, latitude, longitude, num_colonies) VALUES (?, ?, ?, ?, ?)`,
      [log.hive_id, log.date_placed, log.latitude, log.longitude, log.num_colonies]
    );
  },
  deleteHiveLog: async (db, id) => {
    await db.runAsync(`DELETE FROM HiveLogs WHERE id = ?`, [id]);
  },
}));
