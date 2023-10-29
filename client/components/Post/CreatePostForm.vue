<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const title = ref("");
const postType = ref("");

const emit = defineEmits(["refreshPosts"]);

const goBack = () => {
  window.history.back();
};

const createPost = async (title: string, content: string, postType: PostType) => {
  try {
    await fetchy("api/posts", "POST", {
      body: { title: title, content: content, postType: postType },
    });
    console.log("Post created!", { title: { title: title }, body: { content: content }, postType: { postType: postType } });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(title, content, postType)">
    <!-- <label for="post-title">Title:</label> -->
    <textarea id="post-title" v-model="title" placeholder="Write a title!" type="text"></textarea>

    <!-- Selection of three buttons -->
    <div class="post-type center">
      <label>
        <input type="radio" name="postType" value="article" v-model="postType" />
        Article
      </label>
      <label>
        <input type="radio" name="postType" value="question" v-model="postType" />
        Question
      </label>
      <label>
        <input type="radio" name="postType" value="wiki" v-model="postType" />
        Wiki
      </label>
    </div>

    <!-- <label for="post-content">Contents:</label> -->
    <textarea id="post-content" v-model="content" placeholder="Write Something!" required></textarea>

    <row class="center">
      <button type="submit" class="myAniBtn">Create Post</button>
      <button type="button" class="myAniBtn-seondary" @click="goBack">Go Back</button>
    </row>
  </form>
</template>

<style scoped>
form {
  background-color: var(--theme-secondary-color);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#post-title {
  font-size: 1.5em;
  color: var(--theme-bright-text);
  height: 2em;
  text-align: left;
  /* margin-bottom: 1em; */
}

#post-content {
  font-size: 1.5em;
  color: var(--theme-bright-text);
  height: 10em;
  text-align: left;
  margin-bottom: 1em;
}

form {
  background-color: var(--theme-secondary-color);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea,
input {
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

.post-type {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2em; /* Space between the radio options */
  padding: 1em 0; /* Some padding on the top and bottom */
  flex-wrap: wrap; /* Allow wrapping for responsiveness */
}

.post-type label {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  cursor: pointer; /* Makes it clear that the label is clickable */
}

.post-type input[type="radio"] {
  width: 12px; /* Increase the size of the radio button */
  height: 12px;
  margin-right: 10px; /* Space between radio and its label */
  transform: scale(1.5); /* Increase the size */
  cursor: pointer; /* Makes it clear that the radio button is clickable */
}

/* For responsiveness */
@media (max-width: 480px) {
  .post-type {
    flex-direction: column; /* Stack them vertically on small screens */
  }
}
</style>
