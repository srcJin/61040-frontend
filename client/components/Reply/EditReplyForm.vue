<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["reply"]);
const content = ref(props.reply.content);
// console.log("props", props);
// console.log("props.reply=", props.reply);
// console.log("props.reply.content=", props.reply.content);
const emit = defineEmits(["editReply", "refreshReplys"]);

const editReply = async (content: string) => {
  try {
    await fetchy(`api/replys/${props.reply._id}`, "PATCH", { body: { update: { content: content } } });
  } catch (e) {
    return;
  }
  emit("editReply");
  emit("refreshReplys");
};
</script>

<template>
  <form @submit.prevent="editReply(content)">
    <p class="author">{{ props.reply.author }}</p>
    <textarea id="content" v-model="content" placeholder="Create a reply!" required> </textarea>
    <div class="base">
      <menu>
        <li><button class="btn-small pure-button-primary pure-button" type="submit">Save</button></li>
        <li><button class="btn-small pure-button" @click="emit('editReply')">Cancel</button></li>
      </menu>
      <p v-if="props.reply.dateCreated !== props.reply.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.reply.dateUpdated) }}</p>
      <p v-else class="timestamp">Created on: {{ formatDate(props.reply.dateCreated) }}</p>
    </div>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  border-radius: 4px;
  resize: none;
}

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
