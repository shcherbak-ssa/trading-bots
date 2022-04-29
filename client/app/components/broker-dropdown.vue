<template>
  <base-dropdown
      label="Broker"
      placeholder="Select broker"
      loadingPlaceholder="Brokers loading..."
      optionLabel="id"
      :value="props.value"
      :options="props.options"
      :isLoading="props.isLoading"
      :validation="props.validation"
      :disabled="props.disabled"
      @select="selectBroker"
  >
    <template #value="{ value }">
      <broker-data-view type="broker" :brokerName="value.brokerName" />
    </template>

    <template #option="{ option }">
      <broker-data-view
          type="broker"
          :brokerName="option.brokerName"
          :status="option.status"
          :statusTooltip="option.statusTooltip"
      />
    </template>
  </base-dropdown>
</template>

<script setup lang="ts">
import type { DropdownBrokerOption } from 'shared/types';


// Components
import BrokerDataView from 'components/broker-data-view.vue';


// Types
type ComponentProps = {
  options: DropdownBrokerOption[];
  value?: unknown;
  isLoading?: boolean;
  validation?: unknown;
  disabled?: boolean;
  initialValue?: unknown;
}


// Data
const emits = defineEmits(['select']);

const props = withDefaults(defineProps<ComponentProps>(), {
  isLoading: false,
  disabled: false,
});


// Methods
function selectBroker(broker: DropdownBrokerOption): void {
  emits('select', broker);
}
</script>

<style lang="scss" scoped></style>
