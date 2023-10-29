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

    <div class="center">
      <h3>Welcome! {{ currentUsername }}</h3>
    </div>
    <div class="center">
      <h4>Click on the map to navigate to your desired regions in the world!</h4>
    </div>
    <div class="center">
      <h4>Scroll down to view all the posts!</h4>
    </div>

    <!-- <PostListComponent :category="selectedCategory.value" :filter="selectedFilter.value" /> -->
    <section class="main-contents">
      <PostListComponent />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
h3 {
  margin-bottom: 0%;
}
h4 {
  margin-bottom: 0%;
}
</style>
