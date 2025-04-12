import { create } from "zustand";
import { HiveLog, Crop } from "../types";
import { SQLiteDatabase } from "expo-sqlite";
import NetInfo from "@react-native-community/netinfo";

interface AppState {
  hiveLogs: HiveLog[];
  crops: Crop[];
  lastSync?: string;
  loadData: (db: SQLiteDatabase) => Promise<void>;
  checkAndLogUnsyncedChanges: (db: SQLiteDatabase) => Promise<void>;
  markUnsyncedAndMaybeSync: (db: SQLiteDatabase) => Promise<void>; 
}

export const useAppData = create<AppState>((set) => ({
  hiveLogs: [],
  crops: [],
  lastSync: undefined,

  loadData: async (db) => {
    const logs = await db.getAllAsync<HiveLog>("SELECT * FROM HiveLog");
    const crops = await db.getAllAsync<Crop>("SELECT * FROM Crop");
    const meta = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM AppMeta WHERE key = 'last_sync'`
    );

    set({ hiveLogs: logs, crops, lastSync: meta?.value });
  },

  checkAndLogUnsyncedChanges: async (db) => {
    console.log('runing unsync function ');
    
    const result = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM AppMeta WHERE key = 'has_unsynced_changes'`
    );

    if (result?.value === "1") {
      console.log("🔄 Unsynced changes detected!");

      const logs = await db.getAllAsync("SELECT * FROM HiveLog");
      const crops = await db.getAllAsync("SELECT * FROM Crop");
      const userLocations = await db.getAllAsync("SELECT * FROM UserLocation");

      console.log("🐝 Hive Logs:", logs);
      console.log("🌾 Crops:", crops);
      console.log("📍 User Locations:", userLocations);

      await db.runAsync(
        `INSERT OR REPLACE INTO AppMeta (key, value) VALUES (?, ?)`,
        "has_unsynced_changes",
        "0"
      );
    } else {
      console.log("✅ All data is synced.");
    }
  },

  markUnsyncedAndMaybeSync: async (db) => {
    await db.runAsync(
      `INSERT OR REPLACE INTO AppMeta (key, value) VALUES (?, ?)`,
      "has_unsynced_changes",
      "1"
    );

    const netState = await NetInfo.fetch();
    const isOnline = netState.isConnected ?? false;

    if (isOnline) {
      console.log("📡 Online and change detected. Logging now:");
      await useAppData.getState().checkAndLogUnsyncedChanges(db);

      await db.runAsync(
        `INSERT OR REPLACE INTO AppMeta (key, value) VALUES (?, ?)`,
        "has_unsynced_changes",
        "0"
      );
    } else {
      alert("📴 You are offline. Your changes will be synced when you're back online.");
    }
  },
}));
