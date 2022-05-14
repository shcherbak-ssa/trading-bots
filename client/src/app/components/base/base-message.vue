<template>
  <div class="base-message w-full" :class="[props.type]">
    <div class="message-icon">
      <base-icon
          v-if="props.type === 'danger'"
          type="pi"
          icon="exclamation-triangle"
      />

      <base-icon
          v-if="props.type === 'info'"
          type="pi"
          icon="info-circle"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  type: 'info' | 'danger';
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.base-message {
  border-radius: var(--sizes-border-radius-default);
  font: 400 .89rem/1rem 'DM Sans';
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;

  &.info {
    background: var(--colors-primary-005);
    color: var(--colors-primary);
  }

  &.danger {
    background: var(--colors-secondary-005);
    color: var(--colors-secondary);
  }
}

.message-icon {
  margin: 0 auto 5px;

  .base-icon {
    font-size: 1.2rem;
  }
}
</style>
