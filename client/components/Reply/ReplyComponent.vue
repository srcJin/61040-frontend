<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

import likedIcon from "@/assets/eva_fill/heart-fill.svg";
import likeIcon from "@/assets/eva_outline/heart-outline.svg";

// define props
const props = defineProps(["reply"]);
const emit = defineEmits(["editReply", "refreshReplys"]);
const { currentUsername } = storeToRefs(useUserStore());
let likes = ref<Array<Record<string, string>>>([]);
let likesCount = ref(0); // store the fetched like count
let isFavorited = ref(false); // Initialize the ref to store favorited status

// console.log("props", props);

const deleteReply = async () => {
  try {
    await fetchy(`api/replys/${props.reply._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshReplys");
};

async function getLikes(replyId?: string) {
  if (!replyId) return;
  let likesResults;
  // console.log("replyId = ", replyId);
  try {
    likesResults = await fetchy(`/api/likes/reply/${replyId}/like-count`, "GET");
    // console.log("likesResults", likesResults);
  } catch (_) {
    return;
  }

  likes.value = likesResults;

  async function addLike() {
    // Placeholder function for handling the "Like" action for reply
    console.log("Liked reply:", props.reply._id);
    // Here, you'll implement logic to add a like for the reply, and maybe refresh likes count
  }

  onMounted(async () => {
    if (props.reply._id) {
      await checkIfFavorited(props.reply._id);
      await getLikes(props.reply._id);
    }
  });
}
</script>

<template>
  <p>Content: {{ props.reply.content }}</p>
  <p class="">Author: {{ props.reply.author }}</p>
  <p>Type: {{ props.reply.replyType }}</p>

  <div class="base">
    <menu v-if="props.reply.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editReply', props.reply._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deleteReply">Delete</button></li>
    </menu>

    <div class="interaction-icons">
      <button class="icon-button" @click="addLike">
        <img v-if="likesCount > 0" :src="likedIcon" alt="Liked Icon" />
        <img v-else :src="likeIcon" alt="Like Icon" />
      </button>
      <span>Likes: {{ likesCount }}</span>
    </div>

    <article class="timestamp">
      <p v-if="props.reply.dateCreated !== props.reply.dateUpdated">Edited on: {{ formatDate(props.reply.dateUpdated) }}</p>
      <p v-else>Created on: {{ formatDate(props.reply.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1em;
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
  /* vertical-align: middle; */
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
