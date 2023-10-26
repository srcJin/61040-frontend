<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <section class="titlebar">
      <div class="titlebar-text">TitleBar</div>

      <div class="titlebar-user">
        <div v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }">
            <div>
              <img src="@/assets/images/user.svg" class="navicon" />
              <p>{{ currentUsername }}</p>
            </div>
          </RouterLink>
        </div>
        <div v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }">
            <div>
              <img src="@/assets/images/user.svg" class="navicon" />
              <p>Login</p>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <nav class="navbar">
      <div class="title">
        <RouterLink :to="{ name: 'Home' }">
          <img src="@/assets/images/weehive_logo.png" class="navicon" />
          <!-- <h1>WeeHive</h1> -->
        </RouterLink>
      </div>
      <ul class="nav-items">
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }">
            <div>
              <img src="@/assets/images/plaza.svg" class="navicon" />
              <p>Home</p>
            </div>
          </RouterLink>
          <RouterLink :to="{ name: 'Plaza' }" :class="{ underline: currentRouteName == 'Plaza' }">
            <div>
              <img src="@/assets/images/plaza.svg" class="navicon" />
              <p>Plaza</p>
            </div>
          </RouterLink>
          <RouterLink :to="{ name: 'Map' }" :class="{ underline: currentRouteName == 'Map' }">
            <div>
              <img src="@/assets/images/map.svg" class="navicon" />
              <p>Map</p>
            </div>
          </RouterLink>
        </li>
        <div class="navbar-user">
          <li v-if="isLoggedIn">
            <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }">
              <div>
                <img src="@/assets/images/user.svg" class="navicon" />
                <p>Settings</p>
              </div>
            </RouterLink>
            <RouterLink :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }">
              <div>
                <img src="@/assets/images/user.svg" class="navicon" />
                <p>Profile</p>
              </div>
            </RouterLink>
          </li>
          <li v-else>
            <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }">
              <div>
                <img src="@/assets/images/user.svg" class="navicon" />
                <p>Login</p>
              </div>
            </RouterLink>
          </li>
        </div>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

/* Desktop view */

nav {
  padding: 0em 1em;
  /* background-color: lightgray; */
  background-color: var(--theme-color);
  display: flex;
  /* adjust the position of nav */
}

p {
  margin: 0;
  font-size: 0.8em;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  list-style: none;
  padding: 0;
  gap: 1em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

/* li {
  width: 4em;
  text-align: center;
} */

.nav-items li:hover {
  background-color: var(--theme-color-nav);
}

.nav-items {
  /* display: flex; */
  /* gap: 2em;  */
  list-style-type: none;
  margin-left: auto;
  text-align: center;
  align-items: center;
}

.nav-items li {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  gap: 0.5em;
}

.nav-items img {
  /* adjust the size of icon */
  height: 1.5em;
  padding-top: 0.2em;

  margin-bottom: 0.1em;
  align-items: center;
}

.nav-items p {
  margin: 0;
  /* Removes any default margin from the p element */
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

.navicon {
  height: 2em;
  /* display: flex; */
  /* align-items: center;
  justify-content: center;
  margin-right: 0.5em; */
}

.nav-items div {
  flex-direction: column;
  /* Stack the icon and text vertically */
  align-items: center;
  /* Center the content horizontally */
}

.navbar-user {
  display: block;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

.underline {
  text-decoration: underline;
}

.titlebar-text {
  display: none;
}

.titlebar-user {
  display: none;
}

/* Mobile view */
@media (max-width: 767px) {
  nav {
    /* full width */
    width: 100%;
    position: fixed;
    bottom: 0;
    /* Fix to the bottom */
    top: auto;
    /* Override the top: 0; from the desktop styles */
    background-color: var(--theme-color-nav);
    z-index: 1;
  }

  .title {
    display: none;
    /* Hide the logo */
  }

  .navbar {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nav-items {
    margin-left: 0;
    /* Reset the margin */
    justify-content: center;
    /* Centers items horizontally */
    flex-direction: row;
    /* Stacks the links vertically */
  }

  body {
    padding-top: 0;
    /* Reset padding-top for mobile */
    padding-bottom: 60px;
    /* Add padding to the bottom equal to the navbar's height */
  }

  .titlebar {
    display: flex;
    justify-content: space-between;
    background-color: var(--theme-color);
    height: 4em;
  }

  .titlebar-user {
    display: flex;
    margin-left: auto;
    align-items: center; /* vertically center the content of titlebar-user */
    margin-right: 1em;
  }

  .titlebar-text {
    display: flex;
    margin-top: 1em;
    font-size: 1.5em;
    color: var(--theme-bright-text);
    max-height: 2em;
    margin-left: 1em;
    justify-content: left;
    flex-grow: 1; /* This allows it to take up available space */
  }

  .navbar-user {
    display: none;
  }
}
</style>
