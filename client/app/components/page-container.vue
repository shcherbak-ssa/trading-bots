<template>
  <div class="page-container w-full">
    <div class="page-header flex-between">
      <div class="page-heading">{{ props.title }}</div>

      <slot name="actions" />
    </div>

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  title: string;
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.page-container {
  padding: var(--sizes-space-y) var(--sizes-space-default);
}

.page-header {
  margin-bottom: var(--sizes-space-default);
  height: 40px;
}

.page-heading {
  font: 700 1.6875rem/2.2rem 'DM Sans';
}
</style>
