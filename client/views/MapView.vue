<script>
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

// https://github.com/vue-leaflet/vue-leaflet/issues/278

import L from "leaflet";

globalThis.L = L;

export default {
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 3,
    };
  },
};
</script>

<template>
  <div class="fullscreen-map">
    <l-map ref="map" v-model:zoom="zoom" :center="[47.41322, -1.219482]">
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>
    </l-map>
  </div>
</template>

<style>
.fullscreen-map {
  height: calc(100vh - 4em); /* 100% of the viewport height */
  width: 100vw; /* 100% of the viewport width */
  display: flex;
  z-index: 0;
}
</style>
