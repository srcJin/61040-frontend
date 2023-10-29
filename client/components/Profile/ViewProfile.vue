<script setup lang="ts">
// import EditProfileForm from "@/components/Profile/EditProfileForm.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
let profiles = ref<Record<string, string>>();
let editing = ref("");

let username = ref("");
let password = ref("");

// Sample profile data
// let profile = ref({
//   username: "hello",
//   dateCreated: "2023-10-12T16:27:01.885Z",
//   dateUpdated: "2023-10-12T16:48:16.379Z",
//   email: "ffffd@me.co",
//   headshotUrl: "https://robohash.org/hello",
//   identity: "farmer",
//   lastLocation: "[5,5]",
//   nickname: "new nickname",
//   role: "user",
//   user: "651c889c758a0dd39bfecff3",
//   _id: "65281e5517086c41a447c417",
// });

let initProfile = ref({
  username: "loading...",
  dateCreated: "loading...",
  dateUpdated: "loading...",
  email: "loading...",
  headshotUrl: "",
  identity: "loading...",
  lastLocation: "loading...",
  nickname: "loading...",
  role: "loading...",
  user: "loading...",
  _id: "loading...",
});

async function getProfile() {
  // const thisUsername: string = currentUsername;
  await console.log("currentUsername", currentUsername.value);
  let profileResult;
  try {
    // profileResult = await fetchy(`api/profile/${username}`, "GET", { query });
    // console.log(`getProfile api/profile/${currentUsername.value}`);
    profileResult = await fetchy(`api/profile/${currentUsername.value}`, "GET");

    // console.log("getProfile, profileResult=", profileResult);
  } catch (_) {
    console.log("getProfile, error");
    return;
  }
  initProfile.value = profileResult;
}

// function updateEditing(id: string) {
//   editing.value = id;
// }

onBeforeMount(async () => {
  await getProfile();
  loaded.value = true;
});
</script>

<template>
  <section>
    <div class="row">
      <template v-if="isLoggedIn">
        <h2>Your Profile:</h2>
      </template>
      <template v-else>
        <h2>You are not logged in.</h2>
      </template>
    </div>
  </section>

  <section v-if="initProfile">
    <div class="row">
      <div class="headshot-container">
        <div><img class="headshot" :src="initProfile.headshotUrl" alt="Profile headshot" v-if="initProfile.headshotUrl" /></div>
      </div>
    </div>

    <div class="row">
      <!-- <div><strong>User ID:</strong> {{ profile.userId }}</div> -->
      <div><strong>Nickname:</strong> {{ initProfile.nickname }}</div>
    </div>

    <!-- Second Row -->
    <div class="row">
      <!-- <div><strong>Profile ID:</strong> {{ profile.profileId }}</div> -->
      <div><strong>Email:</strong> {{ initProfile.email }}</div>
    </div>

    <div class="row">
      <div><strong>Role:</strong> {{ initProfile.role }}</div>
    </div>

    <div class="row">
      <div><strong>lastLocation:</strong> {{ initProfile.lastLocation }}</div>
    </div>

    <div class="row">
      <div><strong>Identity:</strong> {{ initProfile.identity }}</div>
    </div>
  </section>
</template>

<style scoped>
/* Styles remain largely unchanged; only class names might need slight adjustments if you wish. */
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1em;
}

article {
  background-color: var(--theme-secondary-color);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.profiles {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}

.row > div,
.row > label {
  flex: 1;
  /* This ensures each child of .row takes up equal space */
  display: flex;
  /* Makes label and its children flex items */
  align-items: center;
  /* Vertically center aligns items */
  justify-content: space-between;
  /* Separates label and input */
  margin: 0 0.5em;
  /* Some margin for spacing */
}

.headshot-container {
  display: flex;
  align-items: center;
  gap: 1em;
}

.headshot {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  /* Makes it circular */
  border: 1px solid #d1d1d1;
  /* Adds a border around the image */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* Optional shadow for depth */
  object-fit: cover;
  /* Ensures the image is resized properly within the constraints */
}
</style>
