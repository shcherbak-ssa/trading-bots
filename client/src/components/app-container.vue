<template>
  <div class="app-container flex full">
    <app-menu />

    <router-view />
  </div>
</template>

<script setup lang="ts">
import AppMenu from './app-menu.vue';

</script>

<style scoped>
.app-container {
  background: var(--colors-background-app);
}
</style>
