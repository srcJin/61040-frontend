<script setup lang="ts">
import likedIcon from "@/assets/eva_fill/heart.svg";
import favoritedIcon from "@/assets/eva_fill/star.svg";
import wikiIcon from "@/assets/eva_outline/book-outline.svg";
import questionIcon from "@/assets/eva_outline/bulb-outline.svg";
import articleIcon from "@/assets/eva_outline/file-text-outline.svg";
import likeIcon from "@/assets/eva_outline/heart-outline.svg";
import favoriteIcon from "@/assets/eva_outline/star-outline.svg";
import ReplyListComponent from "../Reply/ReplyListComponent.vue";

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
let isLiked = ref(false); // Initialize the ref to store liked status
let isFavorited = ref(false); // Initialize the ref to store favorited status

const icons = {
  question: questionIcon,
  article: articleIcon,
  wiki: wikiIcon,
};

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
    likesResults = await fetchy(`/api/likes/${postId}/like-count`, "GET");
    console.log("getLikes likesResults = ", likesResults);
    likesCount.value = likesResults.count;
  } catch (_) {
    return;
  }

  likes.value = likesResults;
}

async function toggleLike() {
  try {
    console.log("Toggling like for post:", props.post._id);
    if (isLiked.value) {
      // If the post is already liked, remove the like
      console.log("isLiked", isLiked.value);
      await fetchy(`/api/likes/${props.post._id}`, "DELETE");
      isLiked.value = false;
      likesCount.value--;
    } else {
      // If the post is not liked, add the like
      console.log("isLiked", isLiked.value);
      await fetchy(`/api/likes/${props.post._id}`, "POST");
      isLiked.value = true;
      likesCount.value++;
    }
  } catch (err) {
    console.error("Error toggling like:", err);
  }
}

async function toggleFavorite() {
  try {
    if (isFavorited.value) {
      // If the post is already favorited, remove from favorites
      await fetchy(`/api/favorites/${props.post._id}`, "DELETE");
      isFavorited.value = false;
      console.log("toggleFavorite removing favorited , isFavorited = ", isFavorited.value);
    } else {
      // If the post is not favorited, add to favorites
      await fetchy(`/api/favorites/${props.post._id}`, "POST");
      console.log("toggleFavorite adding favorited , isFavorited = ", isFavorited.value);
      isFavorited.value = true;
    }
  } catch (err) {
    console.error("Error toggling favorite:", err);
  }
}

async function checkIfLiked(postId: string) {
  try {
    console.log("Checking if post is liked:", postId);
    const userLikes = await fetchy(`/api/likes`, "GET"); // Get all likes for the current user
    isLiked.value = userLikes.liked.includes(postId);
    console.log("checkIfLiked isLiked = ", isLiked.value);
  } catch (err) {
    console.error("Error checking like status:", err);
  }
}

async function checkIfFavorited(postId: string) {
  try {
    console.log("Checking if post is liked:", postId);
    const userFavorited = await fetchy(`/api/favorites`, "GET"); // Get all likes for the current user
    console.log("checkIfFavorited userFavorited = ", userFavorited);
    isFavorited.value = userFavorited.favorites.includes(postId);
    console.log("checkIfLiked isFavorited = ", isFavorited.value);
  } catch (err) {
    console.error("Error checking like status:", err);
  }
}

onMounted(async () => {
  if (props.post._id) {
    await checkIfFavorited(props.post._id);
    await getLikes(props.post._id);
    await checkIfLiked(props.post._id);
  }
});
</script>

<template>
  <div class="post-container">
    <div class="title-container">
      <img :src="icons[props.post.postType] ? icons[props.post.postType] : icons['article']" alt="Post type icon" class="post-type-icon" />
      {{ props.post.postType }}
      <h1 class="post-title">{{ props.post.title }}</h1>
      <!-- <p class="post-type">Type: {{ props.post.postType }}</p> -->
      <p class="post-author">Author: {{ props.post.author }}</p>
    </div>

    <div class="content-container">
      <p>{{ props.post.content }}</p>
      <article class="timestamp">
        <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.post.dateCreated) }}</p>
      </article>
    </div>

    <div class="interaction-icons">
      <button class="icon-button" @click="toggleLike">
        <img v-if="isLiked" :src="likedIcon" alt="Liked Icon" />
        <img v-else :src="likeIcon" alt="Like Icon" />
      </button>
      <span>Likes: {{ likesCount }}</span>

      <button class="icon-button" @click="toggleFavorite">
        <img v-if="isFavorited" :src="favoritedIcon" alt="Favorited Icon" />
        <img v-else :src="favoriteIcon" alt="Favorite Icon" />
      </button>
    </div>

    <div class="bottom-container">
      <menu v-if="props.post.author == currentUsername">
        <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
        <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
      </menu>
    </div>
  </div>
  <!-- take the id to pass to ReplyListComponent -->
  <ReplyListComponent :postId="post._id" />
</template>

<style scoped>
p {
  margin: 0em;
  margin-bottom: 1em;
  font-size: 1em;
  color: #333;
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

.bottom-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
  padding: 1em;
  border-radius: 8px;
  background-color: #fff;
}

.info-container article:only-child {
  margin-left: auto;
}
.author {
  font-weight: bold;
  font-size: 1.2em;
  color: #555;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
}

/* Styling buttons for a modern look */
button {
  border: none;
  border-radius: 4px;
  padding: 0.5em 1em;
  font-size: 1em;
  transition: background-color 0.3s ease;
}

.button-error {
  background-color: #e74c3c;
  color: #fff;
}

.button-error:hover {
  background-color: #c0392b;
}

.btn-small.pure-button {
  background-color: #3498db;
  color: #fff;
}

.btn-small.pure-button:hover {
  background-color: #2980b9;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.8em;
  font-style: italic;
  color: #888;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 0;
}

.post-container {
  padding: 1em;
  background-color: #fff;
  border-radius: 8px;
}

.post-title {
  font-family: "Georgia, serif"; /* This is an example; use your desired font here */
  color: #333;
  margin-bottom: 1em;
}

.post-content {
  font-family: "Arial, sans-serif"; /* This is an example; use your desired font here */
  color: #555;
}

.likes,
.favorites {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  width: 24px;
  height: 24px;
}

.post-type-icon {
  margin-right: 8px; /* Adjust the margin as needed */
  vertical-align: middle;
  width: 24px;
  height: 24px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
}

.icon-button img {
  display: block;
  width: 24px;
  height: 24px;
}

.icon-button:focus {
  outline: none;
}
</style>
