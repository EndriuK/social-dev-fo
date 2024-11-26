import { createRouter, createWebHistory } from "vue-router";
import HomePage from "./components/HomePage.vue";
import PageProfile from "./components/PageProfile.vue";
import AppRegistration from "./components/AppRegistration.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/profile", component: PageProfile },
  { path: "/registration", component: AppRegistration },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
