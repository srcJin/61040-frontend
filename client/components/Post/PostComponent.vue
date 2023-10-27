<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// define props
const props = defineProps(["post"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
let likes = ref<Array<Record<string, string>>>([]);
let likesCount = ref(0); // store the fetched like count
let isFavorited = ref(false); // Initialize the ref to store favorited status

// console.log("props", props);

const deletePost = async () => {
  try {
    await fetchy(`api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

async function getLikes(postId?: string) {
  if (!postId) return;
  let likesResults;
  // console.log("postId = ", postId);
  try {
    likesResults = await fetchy(`/api/likes/post/${postId}/like-count`, "GET");
    // console.log("likesResults", likesResults);
  } catch (_) {
    return;
  }

  likes.value = likesResults;

  async function checkIfFavorited(postId: string) {
    try {
      const result = await fetchy(`/api/favorites/isFavorite/${postId}`, "GET");
      isFavorited.value = result.isFavorite; // returns a boolean "isFavorite" property
      console.log("isFavorited", isFavorited.value);
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  }

  onMounted(async () => {
    if (props.post._id) {
      await checkIfFavorited(props.post._id);
      await getLikes(props.post._id);
    }
  });
}
</script>

<template>
  <p>Title: {{ props.post.title }}</p>
  <p class="">Author: {{ props.post.author }}</p>
  <p>Content: {{ props.post.content }}</p>
  <p>Type: {{ props.post.postType }}</p>
  <div class="row">Likes: {{ likesCount }}</div>
  <div class="row">Favorited: {{ isFavorited }}</div>

  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
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
