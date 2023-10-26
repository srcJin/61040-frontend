<script setup lang="ts">
import AbstractWorldmapComponent from "@/components/AbstractWorldmap/AbstractWorldmap.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useTitleStore } from "@/stores/title";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const { setPageTitle } = useTitleStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

onMounted(() => {
  setPageTitle("PlazaPlaza");
});
</script>

<template>
  <main>
    <h1>Plaza</h1>
    <section>
      <!-- <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1> -->
    </section>
    <AbstractWorldmapComponent />

    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
