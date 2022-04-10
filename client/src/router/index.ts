import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "index",
    component: () => import("../views/index.vue"),
  },
  {
    path: "/browse",
    name: "browse",
    component: () => import("../views/browse.vue"),
  },
  {
    path: "/story/:id/:handle",
    name: "story",
    component: () => import("../views/story.vue"),
  },
  {
    path: "/author/:handle",
    name: "author",
    component: () => import("../views/author.vue"),
  },
];

const index = createRouter({
  history: createWebHistory(),
  routes,
});

export default index;
