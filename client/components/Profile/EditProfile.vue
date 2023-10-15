<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername } = storeToRefs(useUserStore());

import { ref } from "vue";

let username = currentUsername.value;
console.log("EditProfile, username=", username);
console.log("username", username);
let nickname = ref("");
let email = ref("");

const { updateUser, updateSession } = useUserStore();
const { updateProfileByUsername } = useProfileStore();

async function updateNickname() {
  console.log("nickname.value", nickname.value);
  await updateProfileByUsername(username, { nickname: nickname.value });
  //   await updateSession();
  nickname.value = "";
}

async function updateEmail() {
  await updateProfileByUsername(username, { email: email.value });
  //   await updateSession();
  email.value = "";
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
</template>
