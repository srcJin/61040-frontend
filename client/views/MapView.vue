<script>
import L from "leaflet";
globalThis.L = L;
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LControlLayers } from "@vue-leaflet/vue-leaflet";
import { LMarker, LTooltip, LWmsTileLayer, LPopup } from "@vue-leaflet/vue-leaflet";
import { ref } from "vue";
import { LMarkerClusterGroup } from "vue-leaflet-markercluster";
import { fetchy } from "../utils/fetchy";
import { onBeforeMount } from "vue";
import "vue-leaflet-markercluster/dist/style.css";
import { useMapStore } from "@/stores/map";

// https://github.com/vue-leaflet/vue-leaflet/issues/278

export default {
  components: {
    LMap,
    LTileLayer,
    LControlLayers,
    LMarker,
    LTooltip,
    LWmsTileLayer,
    LPopup,
    LMarkerClusterGroup,
  },
  setup() {
    const zoom = ref(4);
    const mapStore = useMapStore();

    let centerCoordinate = ref([42.407211, -71.382439]);
    console.log("mapstore", mapStore.lat, mapStore.lng);
    console.log("centerCoordinate.value", centerCoordinate.value);
    if (mapStore.lat && mapStore.lng) {
      centerCoordinate.value = [mapStore.lat, mapStore.lng];
    }
    console.log("centerCoordinate.value 2", centerCoordinate.value);

    // const markers = ref(generateRandomMarkers(20));

    let userCards = ref([]);

    onBeforeMount(async () => {
      userCards.value = await fetchUserCards();
    });

    async function getUsernames() {
      try {
        const users = await fetchy("api/users", "GET");
        return users.map((user) => user.username); // Assuming each user object has a 'username' property
      } catch (error) {
        console.error("Error fetching usernames:", error);
        return [];
      }
    }

    async function getUserProfile(username) {
      try {
        return await fetchy(`api/profile/${username}`, "GET");
      } catch (error) {
        console.error(`Error fetching profile for ${username}:`, error);
        return null;
      }
    }

    async function getPosts(author) {
      let query = author ? { author: author } : {};
      try {
        const postResults = await fetchy("/api/posts", "GET", { query });
        console.log("postResults", postResults);
        return postResults;
      } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
      }
    }

    async function fetchUserCards() {
      const usernames = await getUsernames();
      const userCards = [];

      for (let username of usernames) {
        const userProfile = await getUserProfile(username);
        const userPosts = await getPosts(username);
        console.log("userProfile", userProfile);
        if (userProfile) {
          userCards.push({
            // here I randomly assigned lat and lng, but will later use profile's real data
            lat: 42.407211 + Math.random() * 0.5, // Assuming lastLocation is an array of [lat, lng]
            lng: -71.382439 + Math.random() * 0.5,
            user: {
              _id: userProfile._id, // userId
              description: userProfile.description,
              name: userProfile.nickname,
              posts: userPosts,
              username: username, // Added this line to include the username
              userId: userProfile._id, // Included userId which is essentially same as _id, but you can rename it if you have a different field name for it
            },
          });
        }
      }
      console.log("userCards", userCards);
      return userCards;
    }

    // for testing
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

    const followUser = async (userId) => {
      try {
        await fetchy(`api/relationships/follow/${userId}`, "POST");
        // You can also update the local state here to reflect the followed state, if needed.
        console.log(`Followed user: ${userId}`);
      } catch (error) {
        console.error(`Error following user ${userId}:`, error);
      }
    };

    return {
      zoom,
      centerCoordinate,
      // markers,
      userCards,
      followUser,
    };
  },
};
</script>

<template>
  <div class="fullscreen-map">
    <!-- will load map status later -->
    <l-map ref="map" v-model:zoom="zoom" :center="centerCoordinate">
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
        <l-marker v-for="userCard in userCards" :key="userCard.user.name" :lat-lng="[userCard.lat, userCard.lng]">
          <l-popup>
            <div class="namecard">
              <div class="namecard-header">
                <!-- Placeholder User Icon -->
                <img src="https://xsgames.co/randomusers/avatar.php?g=male" alt="User Icon" class="user-icon" />
                <div>
                  <div>
                    <username>{{ userCard.user.name }}</username>
                    <!-- Defaulted to "Follow" as you did not have relationship data in your example userCards -->
                    {{ userCard.user.userId }}
                    {{ userCard.user.username }}

                    <button class="relationship-btn" @click="() => followUser(userCard.user.username)">Follow</button>
                  </div>
                  <!-- Default Description -->
                  <p class="user-description">Default description</p>
                  <!-- If the user description exists, display it. Otherwise, keep the default. -->
                  <p v-if="userCard.user.description" class="user-description">{{ userCard.user.description }}</p>
                </div>
              </div>

              <div class="posts-container">
                <div v-for="post in userCard.user.posts" :key="post" class="post">
                  <!-- Display Post Content -->
                  <h2 class="post-title">{{ post.title }}</h2>
                  <hr class="divider" />
                  <p class="post-content">{{ post.content }}</p>
                  <div class="interaction-buttons">
                    <!-- Interaction Buttons, kept as they were -->
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
  align-items: center;
  /* vertically center the icon and text */
  justify-content: center;
  /* horizontally center the content */
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
  margin-right: 5px;
  /* Optional: Add a little margin for spacing between the icon and the text */
  vertical-align: middle;
  /* This ensures the icon aligns well with the button text */
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

.posts-container {
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
}

.post {
  background-color: #ffffff;
  /* padding: 12px 16px; */
  margin-bottom: 12px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.post-title {
  font-size: 1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.divider {
  border: 0;
  border-top: 1px solid #eaeaea;
  margin: 8px 0;
}

.post-content {
  font-size: 1em;
  margin: 8px 0;
  color: #555;
}
</style>
