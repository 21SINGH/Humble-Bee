import { create } from "zustand";

type Location = {
    latitude: number;
    longitude: number;
    placeName?: string;
    state?: string;
    country?: string;
    village?: string;
  };
  
  type UserLocationStore = {
    location: Location | null;
    setLocation: (loc: Location) => void;
  };
  

  export const useUserLocation = create<UserLocationStore>((set) => ({
    location: null,
    setLocation: (loc) => set({ location: loc }),
  }));
  
