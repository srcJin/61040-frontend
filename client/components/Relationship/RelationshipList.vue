<script setup lang="ts">
import AddRelationship from "@/components/Relationship/AddRelationship.vue";
import RelationshipComponent from "@/components/Relationship/RelationshipComponent.vue";
import RelationshipRequests from "@/components/Relationship/RelationshipRequests.vue";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const loaded = ref(false);
let relationships = ref<Array<string>>([]);
const requestChildComponent = ref<InstanceType<typeof RelationshipRequests> | null>(null);

async function getRelationships() {
  let relationshipResults;
  try {
    console.log("fetchy getting relationships");
    relationshipResults = await fetchy(`api/relationships/`, "GET");
    console.log("relationshipResults", relationshipResults);
  } catch {
    return;
  }
  relationships.value = relationshipResults.list;
  console.log("relationshipResults", relationshipResults);
}

async function refreshRequests() {
  if (requestChildComponent.value) {
    await requestChildComponent.value.getRequests();
  }
  return;
}

onBeforeMount(async () => {
  await getRelationships();
  loaded.value = true;
});
</script>

<template>
  <div class="row">
    <div class="relationships">
      <h1>My Relationships</h1>
      <h2>Following</h2>

      <article v-if="loaded">
        <p v-if="relationships.length === 0">No relationships yet!</p>
        <p v-for="relationship in relationships" :key="relationship">
          <RelationshipComponent :relationship="relationship" @refreshRelationships="getRelationships" />
        </p>
      </article>
    </div>
    <div class="">
      <section>
        <h1>Add Relationship</h1>
        <AddRelationship @refreshRequests="refreshRequests" />
      </section>
      <section>
        <RelationshipRequests ref="requestChildComponent" @refreshRelationships="getRelationships" />
      </section>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  padding: 1em 1em 0;
  margin: 0 1em 0 0;
  max-height: 60vh;
  overflow-y: auto;
}
</style>
