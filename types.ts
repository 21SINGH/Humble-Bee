// A record of a hive placement by the beekeeper
export interface HiveLog {
  id: number;
  hive_id: string;
  date_placed: string; // ISO format: YYYY-MM-DD
  latitude: number;
  longitude: number;
  num_colonies: number;
  is_ready: 0 | 1;
  photo_uri?: string | null;
}

// A record of a crop that can be pollinated
export interface Crop {
  id: string;
  name: string;
  flowering_start: string; // ISO format
  flowering_end: string; // ISO format
  latitude: number;
  longitude: number;
  recommended_density: number;
}

// Optional metadata for the app (e.g., last sync)
export interface AppMeta {
  key: string;
  value: string;
}
