<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const title = ref("");
const replyType = ref("");

const emit = defineEmits(["refreshReplys"]);

const props = defineProps({
  replyId: String,
});

const createReply = async (content: string, replyType: string) => {
  try {
    await fetchy(`api/replies/${props.replyId}`, "POST", {
      body: { content: content, replyType: replyType },
    });
    console.log("reply created!", { body: { content }, replyType: { replyType } });
  } catch (error) {
    console.error("Error creating reply:", error);
    return;
  }
  emit("refreshReplys");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createReply(content, replyType)">
    <!-- <input id="reply-title" v-model="title" placeholder="Write a title!" type="text" /> -->
    <textarea id="reply-content" v-model="content" placeholder="Write a reply!" required></textarea>
    <div class="reply-type">
      <label>
        <input type="radio" name="replyType" value="comment" v-model="replyType" />
        Comment
      </label>
      <label>
        <input type="radio" name="replyType" value="answer" v-model="replyType" />
        Answer
      </label>
    </div>
    <button type="submit" class="myAniBtn-seondary">Create Reply</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--theme-secondary-color);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

#reply-title {
  font-size: 1.5em;
  color: var(--theme-bright-text);
  height: 2em;
  text-align: left;
  margin-bottom: 1em;
}

#reply-content {
  font-size: 1em;
  color: var(--theme-bright-text);
  height: 1.5em;
  text-align: left;
  margin-bottom: 1em;
}

form {
  background-color: var(--theme-secondary-color);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea,
input {
  font-family: inherit;
  font-size: inherit;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
