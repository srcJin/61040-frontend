<script setup lang="ts">
import AbstractWorldmapComponent from "@/components/AbstractWorldmap/AbstractWorldmap.vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useTitleStore } from "@/stores/title";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
const { setPageTitle } = useTitleStore();
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

let selectedCategory = { value: "Blogs" };
let selectedFilter = { value: "Latest" };

onMounted(() => {
  setPageTitle("PlazaPlaza");
});
</script>

<template>
  <main>
    <h1>Plaza</h1>
    <AbstractWorldmapComponent />
    <div class="button-group">
      <button v-for="(btn, index) in ['Blogs', 'Q&A', 'Wiki']" :key="index" :class="{ active: selectedCategory.value === btn }" @click="selectedCategory.value = btn">
        {{ btn }}
      </button>
    </div>

    <div class="filter-group">
      <button v-for="(filter, index) in ['Latest', 'Trending', 'Nearby']" :key="index" :class="{ active: selectedFilter.value === filter }" @click="selectedFilter.value = filter">
        {{ filter }}
      </button>
    </div>

    <!-- <PostListComponent :category="selectedCategory.value" :filter="selectedFilter.value" /> -->
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
.button-group,
.filter-group {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

button {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  background-color: #f7f7f7;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.active {
  background-color: #e0e0e0;
}
</style>
