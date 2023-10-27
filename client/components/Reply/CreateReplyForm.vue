<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const title = ref("");
const postType = ref("");

const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string) => {
  try {
    await fetchy("api/posts", "POST", {
      title: { title },
      body: { content },
      postType: { postType },
    });
    console.log("Post created!", { title: { title }, body: { content } });
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
  <form @submit.prevent="createPost(content)">
    <!-- Selection of three buttons -->
    <div class="post-type">
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

    <!-- <label for="post-title">Title:</label> -->
    <input id="post-title" v-model="title" placeholder="Write a title!" type="text" />

    <!-- <label for="post-content">Contents:</label> -->
    <textarea id="post-content" v-model="content" placeholder="Write Something!" required></textarea>

    <button type="submit" class="pure-button-primary pure-button">Create Post</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
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
  margin-bottom: 1em;
}

#post-content {
  font-size: 1.5em;
  color: var(--theme-bright-text);
  height: 10em;
  text-align: left;
  margin-bottom: 1em;
}

form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea,
input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
