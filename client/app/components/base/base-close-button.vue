<template>
  <base-button class="close-button circle" @click="$emit('close')">
    <base-icon :icon="addIcon" class="base-icon" />
  </base-button>
</template>

<script setup lang="ts">
import { IconList } from 'shared/constants';

// Data
defineEmits(['close']);

const addIcon = IconList.ADD;
</script>

<style lang="scss" scoped>
.close-button {
  background: var(--colors-secondary-01);

  .base-icon {
    color: var(--colors-secondary);
    transform: rotate(45deg);
  }
}
</style>
