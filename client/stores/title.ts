import { defineStore } from "pinia";

export const useTitleStore = defineStore({
  id: "title",
  state: () => ({
    pageTitle: "WeeHive", // Set default title to image filename
  }),
  actions: {
    setPageTitle(newTitle: string) {
      this.pageTitle = newTitle;
    },
  },
});
