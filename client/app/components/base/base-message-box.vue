<template>
  <div class="message-box w-full" :class="[props.type]">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  type: 'info' | 'error';
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.message-box {
  border-radius: var(--sizes-border-radius-default);
  font: 400 .79rem/1rem 'DM Sans';
  text-align: center;
  padding: 22px 15px;

  &.info {
    background: var(--colors-primary-005);
    color: var(--colors-primary);
  }

  &.error {
    background: var(--colors-secondary-005);
    color: var(--colors-secondary);
  }
}
</style>
