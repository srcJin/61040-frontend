<script setup lang="ts">
import likedIcon from "@/assets/eva_fill/heart-fill.svg";
import favoritedIcon from "@/assets/eva_fill/star-fill.svg";
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
    likesResults = await fetchy(`/api/likes/post/${postId}/like-count`, "GET");
    // console.log("likesResults", likesResults);
  } catch (_) {
    return;
  }

  likes.value = likesResults;

  async function addLike() {
    // Placeholder function for handling the "Like" action
    console.log("Liked post:", props.post._id);
    // Here, you'll implement logic to add a like, and maybe refresh likes count
  }

  async function addFavorite() {
    // Placeholder function for handling the "Favorite" action
    console.log("Favorited post:", props.post._id);
    // Here, you'll implement logic to add a favorite, and maybe update isFavorited status
  }

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
  <div class="post-container">
    <div class="title-container">
      <img :src="icons[props.post.postType] ? icons[props.post.postType] : icons['article']" alt="Post type icon" class="post-type-icon" />
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
      <button class="icon-button" @click="addLike">
        <img v-if="likesCount > 0" :src="likedIcon" alt="Liked Icon" />
        <img v-else :src="likeIcon" alt="Like Icon" />
      </button>
      <span>Likes: {{ likesCount }}</span>

      <button class="icon-button" @click="addFavorite">
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
