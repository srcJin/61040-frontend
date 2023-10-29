<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import PostListComponent from "../components/Post/PostListComponent.vue";
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

import { useTitleStore } from "@/stores/title";
import { onMounted } from "vue";
const { setPageTitle } = useTitleStore();

const selectedCategory = ref<string>("");
const selectedFilter = ref<string>("");

onMounted(() => {
  setPageTitle("BlogBlog");
});
</script>

<template>
  <main>
    <section class="titlebar">
      <div class="titleText">Blog</div>
    </section>
    <section class="main-contents">
      <PostListComponent />
    </section>
  </main>
</template>

<style scoped>
.titleText {
  display: none;
}

.titlebar {
  display: none;
}

@media (max-width: 767px) {
  .titlebar {
    display: flex;
  }
  .titleText {
    display: block;
  }
}

h1 {
  text-align: center;
}
</style>
