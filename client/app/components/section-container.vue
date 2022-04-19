<template>
  <div class="section-container">
    <div v-if="props.title" class="section-title">
      {{ props.title }}
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  title?: string;
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style scoped>
.section-container {
  background: var(--colors-background-section);
  border-radius: var(--sizes-border-radius-default);
  padding: 25px;
}

.section-title {
  font: 500 1.1875rem/1.5rem 'DM Sans';
  margin-bottom: 25px;
  opacity: 0.7;
}
</style>
