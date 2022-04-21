<template>
  <div class="action-container absolute full">
    <div class="action-header flex-between">
      <div class="action-heading">{{ props.heading }}</div>

      <button-close @close="closeActionSection" />
    </div>

    <base-scroll-panel class="action-scroll-panel">
      <div class="action-content">
        <slot />
      </div>
    </base-scroll-panel>
  </div>
</template>

<script setup lang="ts">
import { useCloseActionSection } from 'app/hooks';


// Components
import ButtonClose from 'components/button-close.vue';


// Types
type ComponentProps = {
  heading: string;
}


// Data
const closeActionSection = useCloseActionSection();

const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.action-container {
  background: var(--colors-background-section);
  border-radius: var(--sizes-border-radius-default) 0 0 var(--sizes-border-radius-default);
  padding: var(--sizes-space-y) var(--sizes-space-default) 25px;
}

.action-header {
  margin-bottom: 20px;
}

.action-heading {
  font: 500 1.125rem/1.465rem 'DM Sans';
}

.action-scroll-panel {
  height: calc(100vh - 120px);
}

.action-content {
  padding: 10px 0;
}
</style>
