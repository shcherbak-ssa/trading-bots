<template>
  <div
      class="base-input"
      :class="{
        'is-error': props.validation && props.validation.$invalid && props.validation.$dirty,
      }"
  >
    <div class="input-label flex-align-center">
      <span>{{ props.label }}</span>

      <i
          v-if="props.tooltip"
          v-tooltip.top="props.tooltip"
          class="input-tooltip pi pi-question-circle"
      />
    </div>

    <div class="input-content">
      <slot />
    </div>

    <div v-if="props.helpText" class="input-help">
      {{ props.helpText }}
    </div>

    <template v-if="props.validation && props.validation.$errors.length">
      <div
          v-for="error of props.validation.$errors"
          class="input-help"
          :key="error.$uid"
      >
        {{ error.$message }}
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
// Types
type ComponentProps = {
  label: string;
  validation?: unknown;
  helpText?: string;
  tooltip?: string;
}


// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped></style>
