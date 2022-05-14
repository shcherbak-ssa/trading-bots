<template>
  <prime-vue-button>
    <slot />

    <template v-if="props.buttonLabel">
      <span v-if="!props.isLoading">
        {{ props.buttonLabel }}
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
const props = withDefaults(defineProps<ComponentProps>(), {
  buttonLabel: '',
  isLoading: false,
});
</script>

<style lang="scss" scoped></style>
