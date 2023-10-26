import { defineStore } from "pinia";

export const useTitleStore = defineStore({
  id: "title",
  state: () => ({
    pageTitle: "WeeHive",
  }),
  actions: {
    setPageTitle(newTitle: string) {
      this.pageTitle = newTitle;
    },
  },
});
