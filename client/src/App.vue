<template>
  <div class="min-h-screen w-full bg-gray-50 font-sans">
    <Navbar />
    <RouterView />
  </div>
</template>
<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
</script>
