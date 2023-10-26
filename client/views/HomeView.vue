<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

import { useTitleStore } from "@/stores/title";
import { onMounted } from "vue";
const { setPageTitle } = useTitleStore();

onMounted(() => {
  setPageTitle("BlogBlog");
});
</script>

<template>
  <main>
    <section class="titlebar">
      <div class="titleText">WeeBlog</div>
    </section>
    <section>
      <!-- <h3 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h3>
      <h3 v-else>Please login!</h3> -->
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
.titleText {
  display: none;
}

@media (max-width: 767px) {
  .titlebar {
    display: flex;
    justify-content: center;
    background-color: var(--theme-color);
    min-height: 4em;
  }
  .titleText {
    display: block;
    margin-top: 0.5em;
    font-size: 1.5em;
    color: var(--theme-bright-text);
    max-height: 2em;
  }
}

h1 {
  text-align: center;
}
</style>
