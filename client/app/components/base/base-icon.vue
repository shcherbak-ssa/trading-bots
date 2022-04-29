<template>
  <i
      v-if="props.type === 'pi'"
      class="base-pi-icon pi"
      :class="`pi-${props.icon}`"
  />

  <icon
      v-else-if="props.type === 'mi'"
      class="base-mi-icon"
      :icon="props.icon"
  />
</template>

<script setup lang="ts">
// Components
import { Icon } from '@iconify/vue';


// Types
type ComponentProps = {
  type: 'pi' | 'mi';
  icon: string;
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.base-mi-icon, .base-pi-icon {
  transition: .2s;
}

.base-mi-icon {
  width: 24px;
  height: 24px;
}
</style>
