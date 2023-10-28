<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);

  // Create profile after user registration
  await createProfileByUsername(username.value);

  void updateSession();
  void router.push({ name: "Home" });
}

async function createProfileByUsername(username: string, nickname?: string, email?: string, headshotUrl?: string, identity?: string[], role?: string) {
  try {
    console.log("createProfileByUsername", username, nickname, email, headshotUrl, identity, role);
    await fetchy(`/api/profile/${username}`, "POST", {
      nickname: nickname,
      email: email,
      headshotUrl: headshotUrl,
      identity: identity,
      role: role,
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    throw new Error("Profile creation failed");
  }
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="register">
    <h3>Register User</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="aligned-name">Username</label>
        <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
      </div>
      <div class="pure-control-group">
        <label for="aligned-password">Password</label>
        <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Register</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
</style>
