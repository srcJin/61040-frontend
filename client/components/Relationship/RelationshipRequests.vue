<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const emit = defineEmits(["refreshRelationships"]);
const loaded = ref(false);
let requests = ref<Array<Record<string, string>>>([]);

const relType = "Follow"; // Replace with your actual relType value

async function getRequests(relType: string) {
  let requestResults;
  try {
    requestResults = await fetchy(`/api/relationships/requests/${relType}`, "GET");
  } catch {
    return;
  }
  requests.value = requestResults.requests;
}

async function acceptRequest(from: string, relType: string) {
  try {
    await fetchy(`/api/relationships/accept/${from}/${relType}`, "PUT");
  } catch {
    return;
  }
  emit("refreshRelationships");
}

async function rejectRequest(from: string, relType: string) {
  try {
    await fetchy(`/relationships/reject/${from}/${relType}`, "PUT");
  } catch {
    return;
  }
}

async function removeRequest(from: string, relType: string) {
  try {
    await fetchy(`/relationships/requests/${from}/${relType}`, "DELETE");
  } catch {
    return;
  }
}

onBeforeMount(async () => {
  await getRequests(relType);
  loaded.value = true;
});
</script>
