<script>
import L from "leaflet";
globalThis.L = L;
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControlLayers } from "@vue-leaflet/vue-leaflet";
import { LCircle, LCircleMarker, LIcon, LMarker, LPolygon, LPolyline, LRectangle, LTooltip, LWmsTileLayer, LPopup } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import { LMarkerClusterGroup } from "vue-leaflet-markercluster";

import "vue-leaflet-markercluster/dist/style.css";

// https://github.com/vue-leaflet/vue-leaflet/issues/278

let coordinates = [42.407211, -87.65];

export default {
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LCircle,
    LCircleMarker,
    LIcon,
    LMarker,
    LPolygon,
    LPolyline,
    LRectangle,
    LTooltip,
    LWmsTileLayer,
    LPopup,
    LMarkerClusterGroup,
  },
  setup() {
    const zoom = ref(9);
    const coordinates = ref([42.407211, -71.382439]);
    const markers = ref(generateRandomMarkers(20));

    function generateRandomMarkers(count) {
      const markersArray = [];
      for (let i = 0; i < count; i++) {
        const lat = 42.407211 + Math.random() * 0.5;
        const lng = -71.382439 + Math.random() * 0.5;
        const user = {
          name: `User${Math.round(Math.random() * 1000)}`,
          posts: [`Post content ${Math.round(Math.random() * 1000)}`, `Post content ${Math.round(Math.random() * 1000)}`],
        };
        markersArray.push({ lat, lng, user });
      }
      return markersArray;
    }

    return {
      zoom,
      coordinates,
      markers,
    };
  },
};
</script>

<template>
  <div class="fullscreen-map">
    <!-- will load map status later -->
    <l-map ref="map" v-model:zoom="zoom" :center="[42.407211, -71.382439]">
      <l-wms-tile-layer
        url="https://maps.heigit.org/osmlanduse/service"
        attribution="HeiGIT <a href='osm-wms.de'>OSM WMS</a>"
        layer-type="base"
        name="osm-wms.de"
        :max-zoom="20"
        version="1.3.0"
        format="image/png"
        :transparent="true"
        layers="osmlanduse:osm_lulc_combined_osm4eo"
      />

      <l-tile-layer
        url="http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg"
        layer-type="base"
        name="Stamen Watercolor"
        attribution="Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>."
      />

      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>

      <l-marker :lat-lng="[41.61322, -87.219482]">
        <l-tooltip> And with a tooltip too! </l-tooltip>
      </l-marker>

      <l-marker-cluster-group>
        <l-marker v-for="marker in markers" :key="marker.user.name" :lat-lng="[marker.lat, marker.lng]">
          <l-popup>
            <div class="namecard">
              <div class="namecard-header">
                <img src="https://xsgames.co/randomusers/avatar.php?g=male" alt="User Icon" class="user-icon" />
                <div>
                  <div>
                    <username>{{ marker.user.name }}</username>
                    <button class="relationship-btn">
                      {{ marker.user.relationship ? marker.user.relationship : "Follow" }}
                    </button>
                  </div>
                  <p class="user-description">Defualt discription</p>
                  <p class="user-description">{{ marker.user.description }}</p>
                </div>
              </div>

              <div v-for="post in marker.user.posts" :key="post.content" class="post">
                <p class="user-description">Defualt post content, delete later</p>

                <p>{{ post.content }}</p>
                <div class="interaction-buttons">
                  <button class="comment-btn">
                    <img src="../assets/images/comment.svg" alt="Comment Icon" />
                    <span>Comment</span>
                  </button>

                  <button class="like-btn">
                    <img src="../assets/images/like.svg" alt="Like Icon" />
                    <span>Like</span>
                  </button>

                  <button class="share-btn">
                    <img src="../assets/images/share.svg" alt="Share Icon" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </l-popup>
        </l-marker>
      </l-marker-cluster-group>

      <l-control-layers />
    </l-map>
  </div>
</template>

<style>
.fullscreen-map {
  height: calc(100vh - 4em);
  /* 100% of the viewport height */
  width: 100vw;
  /* 100% of the viewport width */
  display: flex;
  z-index: 0;
}

.div-icon {
  background-color: skyblue;
  width: fit-content;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px black solid;
}

.namecard {
  /* background-color: #f9f9f9; */
  /* border: 1px solid #ccc; */
  padding: 0.5rem;
  width: 250px;
  height: 400px;
  /* border-radius: 5px; */
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.namecard username {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}

.namecard p {
  margin: 0;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.post {
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  border-radius: 5px;
}

.user-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 10px;
}

.namecard-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.namecard-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.content {
  margin-bottom: 0.5rem;
}

.interaction-buttons {
  display: flex;
  gap: 5px;
  margin-top: 0.5rem;
}

.comment-btn,
.like-btn,
.share-btn,
.relationship-btn {
  display: flex;
  align-items: center; /* vertically center the icon and text */
  justify-content: center; /* horizontally center the content */
  padding: 5px 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ddd;
  transition: background-color 0.2s;
}

.comment-btn img,
.like-btn img,
.share-btn img {
  width: 20px;
  height: 10px;
  margin-right: 5px; /* Optional: Add a little margin for spacing between the icon and the text */
  vertical-align: middle; /* This ensures the icon aligns well with the button text */
}

.comment-btn:hover,
.like-btn:hover,
.share-btn:hover,
.relationship-btn:hover {
  background-color: #bbb;
}

.relationship-btn {
  margin-bottom: 1rem;
}
</style>
