<script setup lang="ts">
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

let selectedType = ref(""); // empty means no filter applied

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

function filterByType(type: string) {
  selectedType.value = type;
  getPosts();
}

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  // here use the ref storage to store the selected types
  if (selectedType.value) {
    query.postType = selectedType.value;
  }
  let postResults;
  try {
    postResults = await fetchy("api/posts", "GET", { query });
    // console.log("postResults", postResults);
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPosts();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <div class="type-filters">
      <button class="myAniBtn" @click="filterByType('article')">Article</button>
      <button class="myAniBtn" @click="filterByType('question')">Question</button>
      <button class="myAniBtn" @click="filterByType('wiki')">Wiki</button>
      <router-link to="/createPost">
        <button class="myAniBtn">Create a New Post</button>
      </router-link>
    </div>
  </div>

  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <!-- passing post as a prop name is post, and :post passinto post component-->
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <div></div>
    </article>
  </section>
  <p v-else-if="loaded">No posts found</p>
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
  background-color: var(--theme-secondary-color);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}
.button-container {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  align-items: center; /* Center buttons horizontally within the container */
}
.posts {
  /* padding: 1em; */
}

.row {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 60em;
}

.type-filters {
  display: flex;
  justify-content: center;
  margin: 1em 0;
}
</style>
