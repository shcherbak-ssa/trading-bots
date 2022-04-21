<template>
  <base-button class="button-close circle" @click="$emit('close')">
    <base-icon type="pi" icon="times" />
  </base-button>
</template>

<script setup lang="ts">
// Data
defineEmits(['close']);
</script>

<style lang="scss" scoped>
.button-close {
  background: var(--colors-secondary-01);
  color: var(--colors-secondary);

  .base-pi-icon {
    font-weight: 700;
  }
}
</style>
