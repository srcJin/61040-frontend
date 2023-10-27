<script setup lang="ts">
import AbstractWorldmapComponent from "@/components/AbstractWorldmap/AbstractWorldmap.vue";
import ButtonGroup from "@/components/Button/ButtonGroup.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useTitleStore } from "@/stores/title";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
const { setPageTitle } = useTitleStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const selectedCategory = ref<string>("");
const selectedFilter = ref<string>("");

onMounted(() => {
  setPageTitle("PlazaPlaza");
});
</script>

<template>
  <main>
    <h1>Plaza</h1>
    <AbstractWorldmapComponent />

    <div>
      <ButtonGroup :buttons="['Blogs', 'Q&A', 'Wiki']" :modelValue="selectedCategory" @update:modelValue="(val) => (selectedCategory = val)" />
      <ButtonGroup :buttons="['Latest', 'Trending', 'Nearby']" :modelValue="selectedFilter" @update:modelValue="(val) => (selectedFilter = val)" />

      <!-- Display Selected -->
      <div>Selected Category: {{ selectedCategory }} Selected Filter: {{ selectedFilter }}</div>
    </div>
    <!-- <PostListComponent :category="selectedCategory.value" :filter="selectedFilter.value" /> -->
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
