<script setup lang="ts">
import { ref } from "vue";
import { Story } from "../types";

// TODO: Add filtering functionality
// TODO: Cache stories

interface Response {
  data: {
    pagination: any;
    stories: Story[];
  };
}

const loading = ref(false);
const posts = ref([] as Story[]);
const error = ref<null | string>(null);

const getPosts = async () => {
  loading.value = true;
  const response: Response = await (await fetch("http://localhost:3000/api/posts")).json();

  if (response.data) {
    posts.value = response.data.stories;
  } else {
    posts.value = [];
    error.value = "Something went wrong";
  }
  loading.value = false;
};

const publishedToday = (date: string) => {
  // if date is today, return true
  // dates are in MMM d, yyyy format
  const today = new Date();
  const todayFormatted = `${today.toLocaleString("default", {
    month: "short",
  })} ${today.getDate()}, ${today.getFullYear()}`;
  // remove ordinals from date string
  const dateFormatted = date.replace(/(\d+)(st|nd|rd|th)/g, "$1");

  return todayFormatted === dateFormatted;
};

getPosts();
</script>

<template>
  <div>
    <div class="px-4 pt-16 pb-6">
      <h2 class="container mx-auto text-3xl font-bold">Browse</h2>
    </div>
    <div v-if="loading" class="container mx-auto my-8 font-semibold">
      <p>Loading...</p>
    </div>
    <div v-if="posts" class="container mx-auto my-8 grid grid-cols-12 gap-4">
      <div
        v-for="post in posts"
        :key="post.id"
        class="col-span-12 rounded-xl border border-gray-200 py-4 px-5 transition-all duration-100 ease-in-out hover:border-transparent hover:bg-white hover:shadow-xl lg:col-span-6 2xl:col-span-4"
      >
        <div class="flex flex-col pb-3">
          <div class="flex flex-row items-center justify-between">
            <router-link
              :to="{ name: 'story', params: { id: post.id, handle: post.handle } }"
              class="text-xl font-semibold"
            >
              {{ post.title }}
            </router-link>
            <span
              class="rounded-lg border-2 py-1 px-2 text-sm font-bold leading-none"
              :class="{
                'border-red-500 text-red-500': post.rating === 'R',
                'border-black bg-black text-white': post.rating === 'X',
                'border-green-500 text-green-500': post.rating === 'PG',
              }"
            >
              {{ post.rating }}
            </span>
          </div>
          <router-link
            :to="{ path: `/author/${post.author.name}` }"
            class="self-start font-semibold"
            >{{ post.author.name }}</router-link
          >
          <div
            class="text-sm"
            :class="
              publishedToday(post.publishedAt) ? 'font-semibold text-blue-500' : 'text-gray-500'
            "
          >
            {{ post.publishedAt }}
            {{ publishedToday(post.publishedAt) ? " - Published Today" : "" }}
          </div>
        </div>
        <div v-if="post.tags.length" class="flex flex-row flex-wrap border-y border-gray-200 py-3">
          <div
            v-for="tag in post.tags"
            :key="tag.id"
            class="mr-1 mb-1 rounded-md bg-gray-200 px-3 py-1 text-sm"
          >
            {{ tag.label }}
          </div>
        </div>
        <div class="my-4 text-sm">
          {{ post.description }}
        </div>
      </div>
    </div>
  </div>
</template>
