<script setup lang="ts">
import { ArrowRight } from "@vicons/carbon";
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold leading-relaxed">Welcome to Doc's Lab</h1>
    <p>
      This is a demo of using Node.js and express to web scrape stories from
      <a href="https://docs-lab.com" target="_blank">Doc's Lab</a> and serve it as a consumable API
      for Vue 3.
    </p>
    <p class="my-3">
      This project is in no way perfect, this is my first time doing this, so expect sloppy backend
      code.
    </p>
    <div class="my-8">
      <router-link :to="{ name: 'browse' }" class="inline-flex items-center">
        <span>Browse Stories</span>
        <ArrowRight class="ml-2 h-6 w-6" />
      </router-link>
    </div>
    <div class="my-8">
      <a href="https://github.com/joshwcorbett">My Github</a>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
a {
  @apply underline hover:no-underline;
}
</style>
