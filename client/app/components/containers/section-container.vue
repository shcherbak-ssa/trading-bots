<template>
  <div class="section-container">
    <div v-if="props.heading" class="section-heading">
      {{ props.heading }}
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  heading?: string;
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

.section-heading {
  font: 500 1.1875rem/1.5rem 'DM Sans';
  margin-bottom: 25px;
  opacity: 0.7;
}
</style>
