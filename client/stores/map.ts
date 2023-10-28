// stores/mapStore.js
import { defineStore } from "pinia";

export const useMapStore = defineStore({
  id: "mapStore",

  state: () => ({
    lat: null,
    lng: null,
  }),

  actions: {
    setCoordinates(lat, lng) {
      this.lat = lat;
      this.lng = lng;
    },
    clearCoordinates() {
      this.lat = null;
      this.lng = null;
    },
  },
});
