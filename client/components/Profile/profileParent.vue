<script setup lang="ts">
import ViewProfile from "@/components/Profile/ViewProfile.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");
let profile = ref("");

const { currentUsername } = storeToRefs(useUserStore());

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

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getProfile("hello");
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn">
    <div class="row">
      <!-- <h2 v-else>Profile of {{ searchAuthor }}:</h2> -->
      <ViewProfile @getProfileByUser="getProfile" />
    </div>
  </section>

  <section class="profile" v-if="loaded && profile.length !== 0">
    <!-- <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
    </article> -->
  </section>
  <p v-else-if="loaded">No profile found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.profile {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
