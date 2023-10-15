<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["profile"]);
const nickname = ref(props.profile.nickname);
const email = ref(props.profile.email);
// Add more refs for other profile properties if necessary
const emit = defineEmits(["editProfile", "refreshProfiles"]);

const editProfile = async () => {
  try {
    console.log("editProfile", props.profile.username, { update: { nickname: nickname.value, email: email.value } });
    await fetchy(`api/profile/${props.profile.username}`, "PATCH", { body: { update: { nickname: nickname.value, email: email.value } } });
    // If you have other fields, make sure to include them in the update object
  } catch (e) {
    return;
  }
  emit("editProfile");
  emit("refreshProfiles");
};
</script>

<template>
  <form @submit.prevent="editProfile">
    <p class="user">{{ props.profile.username }}</p>
    <input type="text" v-model="nickname" placeholder="Nickname" required />
    <input type="email" v-model="email" placeholder="Email" required />
    <!-- Add more fields for other profile properties if necessary -->
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editProfile')">Cancel</button></li>
      </menu>
      <!-- Update the timestamp logic based on your profile data structure -->
      <p v-if="props.profile.dateCreated !== props.profile.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.profile.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.profile.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

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

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
