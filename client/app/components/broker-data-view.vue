<template>
  <div
      v-if="props.type === 'broker'"
      class="flex flex-between"
      :class="props.status ? 'w-full' : ''"
  >
    <div class="flex-align-center">
      <img class="input-icon" :src="brokerConfigs[props.brokerName].logo" />
      <div>{{ brokerConfigs[props.brokerName].label }}</div>
    </div>

    <base-status
        v-if="props.status"
        :status="props.status"
        :tooltip="props.statusTooltip"
    />
  </div>

  <div v-if="props.type === 'account'" class="flex-align-center">
    <div>{{ props.name }}</div>
    <div class="capital">{{ `${getCurrencySymbol(props.currency)}${props.amount.toFixed(2)}` }}</div>
  </div>

  <div
      v-if="props.type === 'market'"
      class="market-name"
      :class="props.marketPlace"
  >
    {{ props.name }}
  </div>
</template>

<script setup lang="ts">
import type { BrokerName } from 'global/constants';
import { brokerConfigs } from 'global/config';

import { getCurrencySymbol } from 'shared/utils';


// Types
type ComponentProps = {
  type: 'broker' | 'account' | 'market';
  // broker
  brokerName?: BrokerName;
  status?: string;
  statusTooltip?: string;
  // account
  name?: string;
  currency?: string;
  amount?: number;
  // market
  marketPlace?: 'option' | 'table';
}

// Data
const props = defineProps<ComponentProps>();
</script>

<style lang="scss" scoped>
.capital {
  font: 400 .79rem 'DM Sans';
  margin-left: 10px;
  opacity: .7;
}

.market-name {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 280px;
  white-space: nowrap;

  &.table {
    max-width: 140px;
  }
}
</style>
