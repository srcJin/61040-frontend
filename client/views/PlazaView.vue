<script setup lang="ts">
import AbstractWorldmapComponent from "@/components/AbstractWorldmap/AbstractWorldmap.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useTitleStore } from "@/stores/title";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const { setPageTitle } = useTitleStore();

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const router = useRouter();

// if we scroll to the bottom of the page, routes to /home
const checkScroll = () => {
  const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50; // 50 is a buffer
  if (nearBottom) {
    router.push("/");
  }
};

onMounted(() => {
  setPageTitle("PlazaPlaza");
  window.addEventListener("scroll", checkScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", checkScroll);
});
</script>

<template>
  <main>
    <section class="titlebar">
      <div class="titleText">Plaza</div>
    </section>
    <AbstractWorldmapComponent />
    <!-- <PostListComponent :category="selectedCategory.value" :filter="selectedFilter.value" /> -->
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

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
</style>
