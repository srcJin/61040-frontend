<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername } = storeToRefs(useUserStore());

import { ref } from "vue";

let username = currentUsername.value;
console.log("EditProfile, username=", username);
let nickname = ref("");
let email = ref("");

let role = ref("");
let identity = ref("");
let headshotUrl = ref("");

const { updateUser, updateSession } = useUserStore();
const { updateProfileByUsername } = useProfileStore(); // Assuming these functions exist

async function updateNickname() {
  console.log("nickname.value", nickname.value);
  await updateProfileByUsername(username, { nickname: nickname.value });
  await updateSession();
  nickname.value = "";
}

async function updateEmail() {
  await updateProfileByUsername(username, { email: email.value });
  await updateSession();
  email.value = "";
}

async function updateRole() {
  await updateProfileByUsername(username, { role: role.value });
  await updateSession();
  role.value = "";
}

async function updateIdentity() {
  await updateProfileByUsername(username, { identity: identity.value });
  await updateSession();
  identity.value = "";
}

async function updateHeadshot() {
  await updateProfileByUsername(username, { headshotURL: headshotUrl.value });
  await updateSession();
  headshotUrl.value = "";
}
</script>

<template>
  <h2>Update user profile</h2>
  <form @submit.prevent="updateNickname" class="pure-form">
    <fieldset>
      <legend>Change your nickname</legend>
      <input type="text" placeholder="New nickname" v-model="nickname" required />
      <button type="submit" class="pure-button pure-button-primary">Update nickname</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateEmail" class="pure-form">
    <fieldset>
      <legend>Change your email</legend>
      <input type="email" placeholder="New email" v-model="email" required />
      <button type="submit" class="pure-button pure-button-primary">Update email</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateRole" class="pure-form">
    <fieldset>
      <legend>Change your role</legend>
      <input type="text" placeholder="New role" v-model="role" required />
      <button type="submit" class="pure-button pure-button-primary">Update role</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateIdentity" class="pure-form">
    <fieldset>
      <legend>Change your identity</legend>
      <input type="text" placeholder="New identity" v-model="identity" required />
      <button type="submit" class="pure-button pure-button-primary">Update identity</button>
    </fieldset>
  </form>

  <form @submit.prevent="updateHeadshot" class="pure-form">
    <fieldset>
      <legend>Upload new headshot URL</legend>
      <input type="text" placeholder="New headshot URL" v-model="headshotUrl" required />
      <button type="submit" class="pure-button pure-button-primary">Update headshot URL</button>
    </fieldset>
  </form>
</template>
