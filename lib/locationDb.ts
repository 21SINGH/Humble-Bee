import { useSQLiteContext } from "expo-sqlite";

export const useLocationDB = () => {
  const db = useSQLiteContext();

  const saveUserLocation = async (
    latitude: number,
    longitude: number,
    placeName: string
  ) => {
    await db.runAsync(`DELETE FROM UserLocation`); // Keep only one entry
    await db.runAsync(
      `INSERT INTO UserLocation (latitude, longitude, place_name) VALUES (?, ?, ?)`,
      latitude,
      longitude,
      placeName
    );
  };

  const getUserLocation = async (): Promise<{
    latitude: number;
    longitude: number;
    placeName: string;
  } | null> => {
    const row = await db.getFirstAsync<{
      latitude: number;
      longitude: number;
      place_name: string;
    }>(`SELECT * FROM UserLocation LIMIT 1`);

    return row
      ? {
          latitude: row.latitude,
          longitude: row.longitude,
          placeName: row.place_name,
        }
      : null;
  };

  return { saveUserLocation, getUserLocation };
};
