<script setup lang="ts">
// import EditProfileForm from "@/components/Profile/EditProfileForm.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
const { isLoggedIn } = storeToRefs(useUserStore());

const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
// let profiles = ref<Record<string, string>>();
let editing = ref("");
let profile = ref("");

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

async function getProfile(username: string) {
  // const thisUsername: string = currentUsername;
  await console.log("currentUsername", currentUsername.value);

  let query: Record<string, string> = username !== undefined ? { username } : {};
  let profileResult;
  try {
    console.log("query=", query);
    // profileResult = await fetchy(`api/profile/${username}`, "GET", { query });
    profileResult = await fetchy(`api/profile/${currentUsername.value}`, "GET");

    console.log("getProfile, profileResult=", profileResult);
  } catch (_) {
    console.log("getProfile, error");
    return;
  }
  profile.value = profileResult;
}

// function updateEditing(id: string) {
//   editing.value = id;
// }

onBeforeMount(async () => {
  await getProfile("hello");
  loaded.value = true;
});

const props = defineProps(["profile"]);
console.log("props=", props);
const content = ref(await props.profile);
console.log("content=", content);
const emit = defineEmits(["editProfile", "refreshProfile"]);

// Function to update the profile.
// Implement your API call here to save changes to the backend.
const editProfile = async (content: string) => {
  // try {
  //   console.log("editProfile api/profile/${props.profile._id}=", props.profile._id);
  //   await fetchy(`api/profile/${props.profile._id}`, "PATCH", { body: { update: { content: content } } });
  // } catch (e) {
  //   return;
  // }
  // // TODO add the emit to the component
  // emit("editProfile");
  // emit("refreshProfile");
  return;
};
</script>

<template>
  <section v-if="isLoggedIn">
    <h2>Your Profile:</h2>
  </section>

  <!-- display the profile -->
  <section v-if="profile">
    <div class="row">
      <div class="headshot-container">
        <div><img class="headshot" :src="profile.headshotUrl" alt="Profile headshot" v-if="profile.headshotUrl" /></div>
      </div>
    </div>

    <div class="row">
      <!-- <div><strong>User ID:</strong> {{ profile.userId }}</div> -->
      <div><strong>Nickname:</strong> {{ profile.nickname }}</div>
    </div>

    <!-- Second Row -->
    <div class="row">
      <!-- <div><strong>Profile ID:</strong> {{ profile.profileId }}</div> -->
      <div><strong>Email:</strong> {{ profile.email }}</div>
    </div>

    <div class="row">
      <div><strong>Role:</strong> {{ profile.role }}</div>
    </div>

    <div class="row">
      <div><strong>lastLocation:</strong> {{ profile.lastLocation }}</div>
    </div>

    <div class="row">
      <div><strong>Identity:</strong> {{ profile.identity }}</div>
    </div>
  </section>

  <!-- Edit the profile -->
  <section v-if="isLoggedIn">
    <h2>Edit Profile:</h2>
  </section>

  <section v-if="isLoggedIn">
    <form @submit.prevent="editProfile">
      <form @submit.prevent="editProfile(content)">
        <p class="user">{{ props.profile.user }}</p>
        <textarea id="content" v-model="content" placeholder="Create a post!??" required> </textarea>
        <div class="base">
          <menu>
            <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
            <li><button class="btn-small pure-button" @click="emit('editProfile')">Cancel</button></li>
          </menu>
          <p v-if="props.profile.dateCreated !== props.profile.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.profile.dateUpdated) }}</p>
          <p v-else class="timestamp">Created on: {{ formatDate(props.profile.dateCreated) }}</p>
        </div>
      </form>

      <!-- 
        <div class="row">

<label>
          Username:
          <p class="user">{{ currentUsername.value }}</p>
        </label> -->

      <!-- <label>
          Nickname:
          <input type="text" v-model="profile.nickname" placeholder="Nickname" required />
        </label>
      </div>

      <div class="row">
        <label>
          Headshot URL:
          <input type="text" v-model="profile.headshotUrl" placeholder="Headshot URL" />
        </label>
        <label>
          Email:
          <input type="email" v-model="profile.email" placeholder="Email" required />
        </label>
      </div>
      <div class="row">
        <label>
          Identity:
          <input type="text" v-model="profile.identity" placeholder="Identity" />
        </label>
        <label>
          Last Location:
          <input type="text" v-model="profile.lastLocation" placeholder="Last Location" disabled />
        </label>
      </div>
      <div class="row">
        <label>
          Role:
          <input type="text" v-model="profile.role" placeholder="Role" />
        </label>

        <label>
          User ID:
          <input type="text" v-model="profile.user" placeholder="User ID" disabled />
        </label> 
      </div>-->

      <!-- Not displaying _id as it's typically a database identifier, and shouldn't be editable -->

      <!-- Update the timestamp -->
      <!-- disable for now because the date type -->

      <!-- <p v-if="profile.dateCreated !== profile.dateUpdated" class="timestamp">Edited on: {{ formatDate(profile.dateUpdated) }}</p>
        <p v-else class="timestamp">Created on: {{ formatDate(profile.dateCreated) }}</p> -->
    </form>
  </section>
  <div class="row">
    <!-- <div class="base"> -->
    <menu>
      <button class="btn-small pure-button-primary pure-button" type="submit">Update</button>
    </menu>
    <!-- </div> -->
  </div>
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
  background-color: var(--base-bg);
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
