<template>
  <div
      v-tooltip.bottom="props.tooltip || ''"
      class="base-status select-none"
      :class="{
        [props.status]: true,
        'with-label flex-center': !!props.label,
      }"
  >
    <div v-if="props.label">
      {{ props.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  label?: string | number;
  tooltip?: string;
  status: 'success' | 'info' | 'warning' | 'danger';
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.base-status {
  border-radius: 100%;
  height: 14px;
  width: 14px;

  &.with-label {
    border-radius: var(--sizes-border-radius-default);
    display: inline-flex;
    font-size: .875rem;
    line-height: 1.125rem;
    height: 28px;
    padding: 0 20px;
    width: auto;
  }

  &.success {
    background: var(--colors-accent);
    color: var(--colors-accent);

    &.with-label {
      background: var(--colors-accent-01);
    }
  }

  &.info {
    background: var(--colors-primary);
    color: var(--colors-primary);

    &.with-label {
      background: var(--colors-primary-01);
    }
  }

  &.danger {
    background: var(--colors-secondary);
    color: var(--colors-secondary);

    &.with-label {
      background: var(--colors-secondary-01);
    }
  }

  &.neutral {
    background: var(--colors-text-light);
    color: var(--colors-text-light);

    &.with-label {
      background: var(--colors-text-light-02);
    }
  }
}
</style>
