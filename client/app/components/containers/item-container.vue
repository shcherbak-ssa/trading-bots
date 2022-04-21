<template>
  <section-container class="full">
    <div class="item-header flex-between">
      <div class="item-heading">{{ props.heading }}</div>

      <button-close @close="closeItemSection" />
    </div>

    <base-scroll-panel class="item-scroll-panel">
      <div class="item-content">
        <slot />
      </div>
    </base-scroll-panel>
  </section-container>
</template>

<script setup lang="ts">
import { useCloseItemSection } from 'app/hooks';


// Components
import SectionContainer from 'components/containers/section-container.vue';
import ButtonClose from 'components/button-close.vue';


// Types
type ComponentProps = {
  heading: string;
}


// Data
const closeItemSection = useCloseItemSection();

const props = defineProps<ComponentProps>();


// Methods
</script>

<style lang="scss" scoped>
.item-header {
  font: 500 18px/23.44px 'DM Sans';
  margin-bottom: 20px;
}

.item-scroll-panel {
  height: calc(100% - 60px);
}
</style>
