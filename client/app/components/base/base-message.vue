<template>
  <div class="base-message w-full" :class="[props.type]">
    <div class="message-icon">
      <base-icon v-if="props.type === 'error'" type="mi" :icon="errorIcon" />

      <base-icon v-if="props.type === 'info'" type="mi" :icon="infoIcon" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IconList } from 'shared/constants';

// Types
type ComponentProps = {
  type: 'info' | 'error';
}


// Data
const props = defineProps<ComponentProps>();

const errorIcon = IconList.NOTIFICATION_ERROR;
const infoIcon = IconList.NOTIFICATION_INFO;
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

  &.error {
    background: var(--colors-secondary-005);
    color: var(--colors-secondary);
  }
}

.message-icon {
  margin: 0 auto 5px;
}
</style>
