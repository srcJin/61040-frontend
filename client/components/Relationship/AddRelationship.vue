<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

let user = ref("");
let searchedUser = ref("");
const emit = defineEmits(["refreshRequests"]);
const relType = "Follow"; // Replace with your actual relType value

import { useUserStore } from "@/stores/user";
const { currentUsername } = storeToRefs(useUserStore());

async function requestRelationship(user: string, relType: string) {
  try {
    console.log("requesting relationship", user, relType, currentUsername.value);
    await fetchy(`/api/relationships/requests/${user}/${relType}`, "POST");
  } catch {
    return;
  }
  emit("refreshRequests");
}

async function search(user: string) {
  try {
    searchedUser.value = (await fetchy(`/api/users/${user}`, "GET")).username;
  } catch {
    return;
  }
}
</script>

<template>
  <main>
    <form @submit.prevent="search(user)" class="pure-form">
      <label for="search">Username:</label>
      <div>
        <input id="search" type="text" v-model="user" placeholder="Username" required />
        <button type="submit" @click="search(user)" class="pure-button pure-button-primary">Search</button>
      </div>
    </form>
    <section class="addRelationship" v-if="searchedUser">
      <p>{{ searchedUser }}</p>
      <p><button class="pure-button pure-button-primary" @click="requestRelationship(searchedUser, relType)">Request</button></p>
    </section>
  </main>
  <hr />
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  font-weight: bold;
}

form {
  display: flex;
  width: 100%;
  justify-content: center;
  gap: 1em;
  padding: 1em;
  align-items: center;
}

section {
  display: flex;
  width: 28em;
  padding: 1em 1em 0 1em;
  border-radius: 1em;
  justify-content: space-between;
  align-items: center;
}
</style>
