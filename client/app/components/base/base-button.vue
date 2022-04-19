<template>
  <prime-vue-button>
    <slot />

    <template v-if="buttonLabel">
      <span v-if="!isLoading">
        {{ buttonLabel }}
      </span>

      <base-progress-spinner v-else animationDuration="1.2s" />
    </template>
  </prime-vue-button>
</template>

<script setup lang="ts">
// Components
import PrimeVueButton from 'primevue/button';


// Types
type ComponentProps = {
  buttonLabel?: string;
  isLoading?: boolean;
}


// Data
const { buttonLabel = '', isLoading = false } = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped></style>
