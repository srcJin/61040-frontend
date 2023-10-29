<script setup lang="ts">
import RelationshipList from "@/components/Relationship/RelationshipList.vue";
</script>

<template>
  <main>
    <section class="titlebar">
      <div class="titleText">My Relationships</div>
    </section>
    <section class="main-contents">
      <RelationshipList />
    </section>
  </main>
</template>

<style scoped>
.main-contents {
  padding: 1em 2em;
}
</style>
