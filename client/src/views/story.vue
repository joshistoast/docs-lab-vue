<script lang="ts" setup>
import { ref, computed } from "vue";
import { Story } from "../types";
import { useRoute } from "vue-router";
import {
  ArrowLeft,
  ThumbsUp,
  Chat,
  FaceDissatisfied,
  FaceNeutral,
  FaceCool,
  FacePending,
} from "@vicons/carbon";

interface Response {
  data: Story;
}
const route = useRoute();

const loading = ref(false);
const story = ref(null as Story | null);
const error = ref<null | string>(null);

const storyId = computed(() => {
  const id = route.params.id;
  const handle = route.params.handle;

  return handle && id ? `${id}/${handle}` : null;
});

const getStory = async () => {
  loading.value = true;
  const response: Response = await (
    await fetch("http://localhost:3000/api/story/" + storyId.value)
  ).json();
  if (response.data) {
    story.value = response.data;
  } else {
    story.value = null;
    error.value = "Something went wrong";
  }

  loading.value = false;
};
getStory();
</script>

<template>
  <div>
    <template v-if="loading">
      <div>Loading...</div>
    </template>
    <template v-else>
      <div class="container mx-auto px-6 pt-16 pb-6">
        <router-link
          class="mb-4 -ml-5 inline-flex flex-row items-center rounded-md px-3 py-1 font-medium underline hover:bg-gray-200"
          :to="{ name: 'browse' }"
        >
          <ArrowLeft class="mr-2 h-6 w-6" />
          <span>Browse</span>
        </router-link>
        <div>
          <h2 class="text-3xl font-bold leading-relaxed">{{ story?.title }}</h2>
          <router-link
            class="font-semibold underline hover:no-underline"
            :to="{ name: 'author', params: { handle: story?.author.name } }"
            >{{ story?.author.name }}</router-link
          >
        </div>
      </div>
      <div class="container mx-auto mb-6 flex flex-row flex-wrap px-6">
        <span
          v-for="(tag, i) in story?.tags"
          :key="i"
          class="mr-1 mb-1 rounded-md bg-gray-200 px-3 py-1 text-sm"
        >
          {{ tag }}
        </span>
      </div>
      <div class="border-y border-gray-200">
        <div class="container mx-auto grid grid-cols-12 py-3 px-6">
          <div class="col-span-2 flex flex-row items-center">
            <component
              :is="
                story?.rating <= 50
                  ? FaceDissatisfied
                  : story?.rating <= 79
                  ? FaceNeutral
                  : story?.rating === 'N/A'
                  ? FacePending
                  : FaceCool
              "
              class="mr-2 h-6 w-6"
            >
            </component>
            <span>
              Score: <span class="font-semibold">{{ story?.rating }}</span>
              <span v-if="story?.rating !== 'N/A'"> / 100</span>
            </span>
          </div>
          <div class="col-span-2 flex items-center">
            <ThumbsUp class="mr-2 h-6 w-6" />
            <span>
              Favorites: <span class="font-semibold">{{ story?.favoritesCount }}</span>
            </span>
          </div>
          <div class="col-span-2 flex items-center">
            <Chat class="mr-2 h-6 w-6" />
            <span>
              Comments: <span class="font-semibold">{{ story?.comments.length }}</span>
            </span>
          </div>
        </div>
      </div>
      <div class="container my-6 mx-auto block p-6">
        <h4 class="mb-10 text-lg font-semibold">Story</h4>
        <div v-if="story?.storyHtml" class="prose-base" v-html="story?.storyHtml"></div>
        <div v-else class="prose-base">
          <p>Could not fetch story content :(</p>
          <template v-if="story?.url">
            <p>
              Read it here: <a :href="story?.url">{{ story.url }}</a>
            </p>
          </template>
        </div>
      </div>
      <div class="container mx-auto min-h-[350px] border-t border-gray-200 p-6">
        <template v-if="!story?.comments.length">
          <p class="text-lg font-bold">No Comments (yet)</p>
        </template>
        <template v-else>
          <h3 class="mb-8 text-xl font-bold">
            Comments <span>({{ story?.comments.length }})</span>
          </h3>
          <div class="grid grid-cols-1 gap-8">
            <div
              v-for="(comment, i) in story?.comments"
              :key="i"
              class="border-l-4 border-gray-500 pl-6"
            >
              <div class="mb-3">
                <router-link
                  :to="{ name: 'author', params: { handle: comment.name } }"
                  class="font-semibold underline hover:no-underline"
                  >{{ comment.name }}</router-link
                >
                <div class="text-gray-500">{{ comment.date }}</div>
              </div>
              <div>
                {{ comment.body }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
