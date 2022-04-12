<template>
  <div class="base-input" :class="{ 'is-error': props.isError }">
    <div class="input-label">{{ props.label }}</div>

    <prime-vue-input-text
        v-if="props.type === 'text'"
        class="input-container"
        v-model="state.value"
    />

    <prime-vue-calendar
        v-else-if="props.type === 'date'"
        class="input-container"
        dateFormat="yy-mm-dd"
        showIcon
        :minDate="new Date()"
        v-model="state.value"
    />

    <div v-if="props.helpText" class="input-help">
      {{ props.helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { InputValue } from 'shared/types';


// Components
import PrimeVueInputText from 'primevue/inputtext';
import PrimeVueCalendar from 'primevue/calendar';


// Types
type ComponentState = {
  value: InputValue;
}

type ComponentProps = {
  value: InputValue;
  label: string;
  type: string;
  isError: boolean;
  helpText: string;
}


// Data
const emit = defineEmits(['input']);
const props = defineProps<ComponentProps>();
const state = reactive<ComponentState>({
  value: props.value,
});

watch(() => state.value, () => {
  emit('input', state.value);
});
</script>

<style lang="scss" scoped></style>
