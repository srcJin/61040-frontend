<script setup lang="ts">
import EditReplyForm from "@/components/Reply/EditReplyForm.vue";
import ReplyComponent from "@/components/Reply/ReplyComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import CreateReplyForm from "./CreateReplyForm.vue";

const { isLoggedIn } = storeToRefs(useUserStore());

// define a prop to store postID from the postComponent
const props = defineProps({
  postId: String,
});

const loaded = ref(false);
let replies = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getReplies(postId: string) {
  let replyResults;
  try {
    // console.log("getReplies api/replies/${postId}", `api/replies/${postId}`);
    replyResults = await fetchy(`api/replies/${postId}`, "GET");
    // console.log("replyResults", replyResults);
  } catch (_) {
    return;
  }
  replies.value = replyResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getReplies(props.postId);
  loaded.value = true;
});
</script>

<template>
  <section class="replies" v-if="loaded && replies.length !== 0">
    <article v-for="reply in replies" :key="reply._id">
      <ReplyComponent v-if="editing !== reply._id" :reply="reply" @refreshReplies="getReplies" @editReply="updateEditing" />
      <EditReplyForm v-else :reply="reply" @refreshReplies="getReplies" @editReply="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded" class="lightgrey-text">Become the first to reply!</p>
  <p v-else class="lightgrey-text">Loading...</p>
  <CreateReplyForm :postId="postId" @refreshReplies="getReplies" />
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 80em;
}

article {
  background-color: var(--theme-secondary-color);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.replies {
  padding: 0em;
}

.lightgrey-text {
  color: rgb(100, 100, 100);
  margin-top: 20px;
}
</style>
