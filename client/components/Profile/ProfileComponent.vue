<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";

const props = defineProps(["profile"]);
const emit = defineEmits(["editProfile", "refreshProfiles"]);
const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <p class="user">{{ props.profile.nickname }}</p>
  <p>Email: {{ props.profile.email }}</p>
  <div class="base">
    <menu v-if="props.profile.username == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editProfile', props.profile.username)">Edit</button></li>
    </menu>
    <article class="timestamp">
      <!-- I'm making an assumption here that profile has dateCreated and dateUpdated fields -->
      <p v-if="props.profile.dateCreated !== props.profile.dateUpdated">Edited on: {{ formatDate(props.profile.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.profile.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
/* Styles remain largely unchanged */

p {
  margin: 0em;
}

.user {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
