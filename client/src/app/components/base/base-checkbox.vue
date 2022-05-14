<template>
  <div class="field-checkbox flex-align-center">
    <prime-vue-checkbox
        v-model="state.checked"
        :id="props.checkboxId"
        :binary="true"
        @change="changeValue"
    />

    <label class="cursor-pointer" :for="props.checkboxId">
      {{ props.label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';


// Components
import PrimeVueCheckbox from 'primevue/checkbox';


// Types
type ComponentState = {
  checked: boolean;
}

type ComponentProps = {
  value: boolean;
  label: string;
  checkboxId: string;
}


// Data
const emits = defineEmits(['change']);
const props = defineProps<ComponentProps>();

const state = reactive<ComponentState>({
  checked: props.value,
});

watch(() => props.value, () => {
  state.checked = props.value;
});


// Methods
function changeValue(): void {
  emits('change', state.checked);
}
</script>

<style lang="scss" scoped>
.field-checkbox {
  margin: 20px 0;
}
</style>
