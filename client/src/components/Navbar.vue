<script setup lang="ts"></script>

<template>
  <header class="sticky top-0 w-full border-b border-gray-200 bg-white py-4">
    <nav class="container mx-auto flex items-center px-6">
      <router-link class="mr-4 text-lg font-bold" :to="{ name: 'index' }">Doc's Lab</router-link>
      <router-link class="hover:underline" :to="{ name: 'browse' }">Browse</router-link>
    </nav>
  </header>
</template>
