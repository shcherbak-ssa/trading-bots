<template>
  <input-container
      :label="props.label"
      :validation="props.validation"
  >
    <prime-vue-dropdown
        v-model="state.selectedValue"
        class="input"
        :options="props.options"
        :placeholder="props.isLoading ? props.loadingPlaceholder : props.placeholder"
        :loading="props.isLoading"
        :optionLabel="props.optionLabel"
        :optionGroupLabel="props.optionGroupLabel"
        :optionGroupChildren="props.optionGroupChildren"
        :emptyMessage="props.emptyMessage"
        :filter="props.filter"
        :disabled="props.disabled"
        @change="selectValue"
    >
      <template #value="{ value, placeholder }">
        <div class="dropdown-value" v-if="value">
          <slot name="value" :value="value" />
        </div>
        <span v-else class="input-placeholder">
          {{ placeholder }}
        </span>
      </template>

      <template #option="{ option }">
        <div class="dropdown-option">
          <slot name="option" :option="option" />
        </div>
      </template>
    </prime-vue-dropdown>
  </input-container>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';


// Components
import InputContainer from 'components/containers/input-container.vue';
import PrimeVueDropdown from 'primevue/dropdown';


// Types
type ComponentState = {
  selectedValue: unknown;
}

type ComponentProps = {
  label: string;
  options: unknown[];
  placeholder: string;
  value?: unknown;
  validation?: unknown;
  isLoading?: boolean;
  loadingPlaceholder?: string;
  optionLabel?: string;
  optionGroupLabel?: string;
  optionGroupChildren?: string;
  emptyMessage?: string;
  filter?: boolean;
  disabled?: boolean;
}


// Data
const emits = defineEmits(['select']);

const props = withDefaults(defineProps<ComponentProps>(), {
  isLoading: false,
  loadingPlaceholder: 'Loading...',
  optionLabel: 'label',
  emptyMessage: 'No options available',
  filter: false,
  disabled: false,
});

const state = reactive<ComponentState>({
  selectedValue: props.value !== undefined ? props.value : null,
});

watch(() => props.value, () => {
  if (props.value !== undefined) {
    state.selectedValue = props.value;
  }
});


// Methods
function selectValue(): void {
  if (state.selectedValue) {
    emits('select', state.selectedValue);
  }
}
</script>

<style lang="scss" scoped></style>
