<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const time = ref("");
const postType = ref("answer"); // Default value
const emit = defineEmits(["searchPosts"]);

function handleSubmit() {
  const searchData = {
    author: author.value,
    time: time.value,
    postType: postType.value,
  };
  emit("searchPosts", searchData);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="pure-form">
    <fieldset>
      <legend>Search Posts</legend>
      <div class="form-row">
        <!-- Author Input -->
        <label for="author">Author:</label>
        <input id="author" type="text" v-model="author" placeholder="Username" />

        <!-- Time Input -->
        <label for="time">Time:</label>
        <input id="time" type="date" v-model="time" />

        <!-- Post Type Dropdown -->
        <label for="postType">Post Type:</label>
        <select id="postType" v-model="postType">
          <option value="answer">Answer</option>
          <option value="article">Article</option>
          <option value="wiki">Wiki</option>
        </select>

        <!-- Submit Button -->
        <button type="submit" class="pure-button pure-button-primary">Search</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* This assumes you want to center it in the entire viewport. Adjust as needed. */
}

form {
  padding: 1em;
  width: 100%;
  max-width: 800px; /* This sets a maximum width for the form. Adjust as per your design needs. */
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1em;
}

label {
  font-weight: bold;
}

/* Media query for smaller screens */
@media (max-width: 767px) {
  .form-row {
    /* flex-direction: column; */
    align-items: flex-start;
  }
}
</style>
