<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["relationship", "relType"]);
const emit = defineEmits(["refreshRelationships"]);
const { currentUsername } = storeToRefs(useUserStore());

async function removeRelationship(user2: string, relType: string) {
  try {
    console.log(`/api/relationships/${currentUsername.value}/${user2}/${relType}`, "DELETE");
    await fetchy(`/api/relationships/${user2}/${relType}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshRelationships");
}
</script>

<template>
  <section>
    {{ props.relationship }}
    <button @click="removeRelationship(props.relationship, 'Follow')" class="myAniBtn-accent">Remove</button>
  </section>
</template>

<style scoped>
section {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
</style>
