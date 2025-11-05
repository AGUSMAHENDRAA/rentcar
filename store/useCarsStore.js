// store/bikesStore.ts
import { create } from "zustand";

export const useCarsStore = create((set) => ({
  cars: [],
  setCars: (newCars) => set({ bikes: newCars }),
  updateBikeUnit: (id, newUnit) =>
    set((state) => ({
      bikes: state.bikes.map((bike) =>
        bike.id === id ? { ...bike, unit: newUnit } : bike
      ),
    })),
}));
