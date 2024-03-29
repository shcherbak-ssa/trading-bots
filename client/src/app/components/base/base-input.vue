<template>
  <input-container
      :class="props.useButton ? 'inline' : ''"
      :label="props.label"
      :tooltip="props.tooltip"
      :validation="props.validation"
      :helpText="props.helpText"
  >
    <prime-vue-input-text
        v-if="props.type === 'text'"
        v-model="state.value"
        class="input"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
    />

    <prime-vue-password
        v-if="props.type === 'password'"
        v-model="state.value"
        class="input"
        :toggleMask="true"
        :feedback="false"
        :placeholder="props.placeholder"
    />

    <template v-if="props.type === 'number'">
      <prime-vue-input-number
          v-model="state.value"
          class="input"
          :placeholder="props.placeholder"
          :suffix="props.numberSuffix"
          :min="props.numberMin"
          :max="props.numberMax"
          :minFractionDigits="props.numberMinFractionDigits"
          :maxFractionDigits="props.numberMaxFractionDigits"
          :disabled="props.disabled || props.numberUseSlider"
      />

      <prime-vue-slider
          v-if="props.numberUseSlider"
          v-model="state.value"
          :min="props.numberMin"
          :max="props.numberMax"
          :step="props.numberSliderStep"
      />
    </template>

    <prime-vue-calendar
        v-else-if="props.type === 'date'"
        v-model="state.value"
        class="input"
        dateFormat="yy-mm-dd"
        :placeholder="props.placeholder"
        :showIcon="true"
        :manualInput="false"
        :minDate="new Date()"
    />

    <div
        v-if="props.useIcon"
        class="input-icon flex-center"
        @click="$emit('icon-click')"
    >
      <base-icon type="pi" :icon="props.icon" />
    </div>

    <slot name="button" />
  </input-container>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';


// Components
import InputContainer from 'components/containers/input-container.vue';
import PrimeVueInputText from 'primevue/inputtext';
import PrimeVuePassword from 'primevue/password';
import PrimeVueInputNumber from 'primevue/inputnumber';
import PrimeVueCalendar from 'primevue/calendar';
import PrimeVueSlider from 'primevue/slider';


// Types
type ComponentState = {
  value: unknown;
}

type ComponentProps = {
  value: unknown;
  label: string;
  type: string;
  validation?: unknown;
  helpText?: string;
  placeholder?: string;
  disabled?: boolean;
  tooltip?: string;
  useButton?: boolean;
  icon?: string;
  useIcon?: boolean;

  numberSuffix?: string;
  numberMax?: number;
  numberMin?: number;
  numberMinFractionDigits?: number;
  numberMaxFractionDigits?: number;
  numberUseSlider?: boolean;
  numberSliderStep?: number;
}


// Data
const emits = defineEmits(['input', 'icon-click']);
const props = defineProps<ComponentProps>();

const state = reactive<ComponentState>({
  value: props.value,
});

watch(() => props.value, () => {
  state.value = props.value;
});

watch(() => state.value, () => {
  emits('input', state.value);
});
</script>

<style lang="scss" scoped></style>
