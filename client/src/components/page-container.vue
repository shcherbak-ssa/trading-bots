<template>
  <div class="page-container">
    <div class="page-heading">{{ props.title }}</div>

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';


type ComponentProps = {
  title: string;
}


const props = defineProps<ComponentProps>();
</script>

<style scoped>
.page-container {
  padding: var(--sizes-space-y) var(--sizes-space-default);
}

.page-heading {
  font: 700 1.6875rem/2.2rem 'DM Sans';
  margin-bottom: var(--sizes-space-default);
}
</style>