<template>
  <div class="action-container absolute full">
    <div class="action-header flex-between">
      <div class="action-title">{{ props.title }}</div>

      <base-close-button @close="closeActionSection" />
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
import { StoreMutation } from 'shared/constants';

import { useStore } from 'app/store';


// Components
import BaseCloseButton from 'components/base/base-close-button.vue';


// Types
type ComponentProps = {
  title: string;
}


// Data
const { commit } = useStore();
const props = defineProps<ComponentProps>();


// Methods
function closeActionSection() {
  commit({
    type: StoreMutation.CLOSE_ACTION_SECTION,
  });
}
</script>

<style lang="scss" scoped>
.action-container {
  background: var(--colors-background-section);
  border-radius: var(--sizes-border-radius-default) 0 0 var(--sizes-border-radius-default);
  padding: var(--sizes-space-y) var(--sizes-space-default);
}

.action-header {
  margin-bottom: var(--sizes-space-default);
}

.action-title {
  font: 500 1.125rem/1.465rem 'DM Sans';
}
</style>
