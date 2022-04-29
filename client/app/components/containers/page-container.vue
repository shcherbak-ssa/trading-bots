<template>
  <div class="full">
    <div class="page-header flex-between">
      <div class="page-heading">{{ props.heading }}</div>

      <slot name="actions" />
    </div>

    <div
        class="page-content"
        :class="{ 'is-item-section-active': storeState.itemSection.isActive }"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Store, useStore } from 'app/store';
// Types
type ComponentProps = {
  heading: string;
}


// Data
const { state: storeState }: Store = useStore();

const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.page-header {
  margin-bottom: var(--sizes-space-default);
  height: 40px;
}

.page-heading {
  font: 700 1.6875rem/2.2rem 'DM Sans';
}

.page-content {
  transition: .2s;
  width: 100%;
  height: calc(100% - 70px);

  &.is-item-section-active {
    width: calc(50% - 15px);
  }
}
</style>
