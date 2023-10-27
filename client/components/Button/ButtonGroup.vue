<template>
  <div class="button-group">
    <button v-for="btn in buttons" :key="btn" :class="{ active: value === btn }" @click="selectButton(btn)">
      {{ btn }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    buttons: {
      type: Array as () => string[],
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },

  setup(props, { emit }) {
    const selectButton = (btn: string) => {
      emit("update:modelValue", btn);
    };

    return {
      value: props.modelValue,
      selectButton,
    };
  },
});
</script>

<style scoped>
.button-group {
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
  background-color: #8d8d8d;
}
</style>
