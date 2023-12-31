import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import BlogView from "../views/BlogView.vue";
import CreatePostView from "../views/CreatePostView.vue";
import LoginView from "../views/LoginView.vue";
import MapView from "../views/MapView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PlazaView from "../views/PlazaView.vue";
import ProfileView from "../views/ProfileView.vue";
import RelationshipView from "../views/RelationshipView.vue";
import SettingView from "../views/SettingView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Plaza",
      component: PlazaView,
      meta: { requiresAuth: false },
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/map",
      name: "Map",
      component: MapView,
      meta: { requiresAuth: false },
    },
    {
      path: "/blog",
      name: "Blog",
      component: BlogView,
      meta: { requiresAuth: false },
    },
    {
      path: "/relationship",
      name: "Relationship",
      component: RelationshipView,
      meta: { requiresAuth: true },
    },
    {
      path: "/CreatePost",
      name: "CreatePost",
      component: CreatePostView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
