<script setup lang="ts">
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "@/components/Post/PostComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SearchPostForm from "./SearchPostForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

const loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);
let likes = ref<Array<Record<string, string>>>([]);
let editing = ref("");
let searchAuthor = ref("");

const likesCount = ref(0); // store the fetched like count

async function getPosts(author?: string) {
  let query: Record<string, string> = author !== undefined ? { author } : {};
  let postResults;
  try {
    postResults = await fetchy("api/posts", "GET", { query });
    console.log("postResults", postResults);
  } catch (_) {
    return;
  }
  searchAuthor.value = author ? author : "";
  posts.value = postResults;
}

async function getLikes(postId?: string) {
  if (!postId) return;
  let likesResults;
  console.log("postId = ", postId);
  try {
    likesResults = await fetchy(`/api/likes/post/${postId}/like-count`, "GET");
    console.log("likesResults", likesResults);
  } catch (_) {
    return;
  }
  likes.value = likesResults;
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
  <section v-if="isLoggedIn">
    <h2>Create a post:</h2>
    <CreatePostForm @refreshPosts="getPosts" />
  </section>
  <div class="row">
    <h2 v-if="!searchAuthor">Posts:</h2>
    <h2 v-else>Posts by {{ searchAuthor }}:</h2>
    <SearchPostForm @getPostsByAuthor="getPosts" />
  </div>

  <div class="row">
    <form @submit.prevent="getLikes(postId)" class="pure-form">
      <fieldset>
        <legend>getLikes</legend>
        <input id="likes" type="text" v-model="postId" placeholder="PostId" />
        <button type="submit" class="pure-button pure-button-primary">Get</button>
      </fieldset>
    </form>
    <!-- Display the like count after fetching -->
    <div v-if="likesCount" class="like-result">Likes count for the post: {{ likesCount }}</div>
  </div>

  <section class="posts" v-if="loaded && posts.length !== 0">
    <article v-for="post in posts" :key="post._id">
      <PostComponent v-if="editing !== post._id" :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />
      <EditPostForm v-else :post="post" @refreshPosts="getPosts" @editPost="updateEditing" />

      <div>
        <ul>
          <li v-for="post in posts" :key="post.id">{{ post.title }} - Likes: {{ getLikes(post.id) }}</li>
        </ul>
      </div>
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
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
