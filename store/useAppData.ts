// stores/useAppData.ts
import { create } from 'zustand';
import { HiveLog, Crop } from '../types';
import { SQLiteDatabase } from 'expo-sqlite';

interface AppState {
  hiveLogs: HiveLog[];
  crops: Crop[];
  lastSync?: string;
  loadData: (db: SQLiteDatabase) => Promise<void>;
}

export const useAppData = create<AppState>((set) => ({
  hiveLogs: [],
  crops: [],
  lastSync: undefined,
  loadData: async (db) => {
    const logs = await db.getAllAsync<HiveLog>('SELECT * FROM HiveLog');
    const crops = await db.getAllAsync<Crop>('SELECT * FROM Crop');
    const meta = await db.getFirstAsync<{ value: string }>(
      `SELECT value FROM AppMeta WHERE key = 'last_sync'`
    );

    set({
      hiveLogs: logs,
      crops,
      lastSync: meta?.value,
    });
  },
}));
