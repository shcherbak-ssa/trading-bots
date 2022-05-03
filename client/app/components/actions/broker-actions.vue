<template>
  <action-container :heading="storeGetters.isBrokerSelected ? 'Edit broker' : 'Connect broker'">
    <broker-dropdown
        :value="state.selectedBrokerOption"
        :options="brokersDropdownOptions"
        :disabled="storeGetters.isBrokerSelected"
        @select="selectBroker"
    />

    <base-message v-if="state.message" :type="state.messageType">
      <div v-html="state.message" />
    </base-message>

    <template v-if="state.selectedBroker !== null">
      <base-input
          v-for="input in state.selectedBroker.inputs"
          :key="state.selectedBroker.name + '-' + input.key"
          :value="state.inputs[input.key]"
          :label="input.label"
          :placeholder="input.placeholder"
          :type="input.type"
          :validation="v$.inputs[input.key]"
          @input="(value) => state.inputs[input.key] = value"
      />

      <base-button
          class="block"
          :buttonLabel="storeGetters.isBrokerSelected ? 'Update' : 'Connect'"
          :isLoading="state.isLoading"
          @click="runBrokerAction"
      />
    </template>
  </action-container>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import type { Broker } from 'global/types';

import type { BrokerConnectConfig, DropdownBrokerOption } from 'shared/types';
import { ActionType } from 'shared/constants';
import { brokerConnectConfigs } from 'shared/config';

import { Notifications } from 'services/notifications';
import { runAction } from 'services/actions';

import { useCloseActionSection } from 'app/hooks';
import { Store, useStore } from 'app/store';


// Components
import ActionContainer from "components/containers/action-container.vue";
import BrokerDropdown from 'components/broker-dropdown.vue';


// Types
type ComponentState = {
  isLoading: boolean;
  selectedBroker: BrokerConnectConfig | null;
  selectedBrokerOption: DropdownBrokerOption | null;
  inputs: { [p: string]: string | Date; };
  message: string;
  messageType: string;
}


// Data
const { state: storeState, getters: storeGetters, commit }: Store = useStore();

const closeActionSection = useCloseActionSection();

const state = reactive<ComponentState>({
  isLoading: false,
  selectedBroker: null,
  selectedBrokerOption: null,
  inputs: {},
  message: '',
  messageType: '',
});

const validationRules = computed(() => {
  return {
    inputs: {
      ...Object.fromEntries(
          Object.entries(state.inputs).map(([key]) => [key, { required }])
      ),
    },
  };
});

const v$ = useVuelidate(validationRules, state);

  const brokersDropdownOptions: DropdownBrokerOption[] = getDropdownBrokerOptionsFromConfigs();


// Hooks
onMounted(() => {
  const { selectedBroker } = storeState.actionSection;

  if (selectedBroker) {
    const { name: brokerName } = selectedBroker;

    state.selectedBrokerOption = { id: brokerName, brokerName };

    selectBroker(state.selectedBrokerOption);
  }
});


// Methods
function selectBroker({ brokerName, status }: DropdownBrokerOption): void {
  if (status) {
    state.selectedBroker = null;
    state.message = 'Broker is already connected.';
    state.messageType = 'info';

    return;
  }

  const selectedBroker = brokerConnectConfigs[brokerName];

  v$.value.$reset();

  state.selectedBroker = selectedBroker;
  state.inputs = {};
  state.message = '';

  for (const { key } of selectedBroker.inputs) {
    state.inputs[key] = '';
  }
}

async function runBrokerAction(): Promise<void> {
  const { selectedBroker, inputs } = state;

  if (selectedBroker === null) return;

  state.message = '';

  v$.value.$reset();
  const isInputsValid: boolean = await v$.value.$validate();

  if (!isInputsValid) {
    Notifications.showErrorNotification(`Validation error`, `Please, enter the data correctly`);

    return;
  }

  state.isLoading = true;

  const { expiresAt, ...apiKeys } = inputs;
  const { selectedBroker: storeBroker } = storeState.actionSection;

  const actionType = storeBroker ? ActionType.BROKERS_UPDATE : ActionType.BROKERS_CONNECT;

  const actionPayload = storeBroker
    ? { id: storeBroker.id, name: selectedBroker.name, updates: { expiresAt, apiKeys } }
    : { name: selectedBroker.name, expiresAt, apiKeys };

  await runAction({
    type: actionType,
    payload: actionPayload,
    callback: () => {
      closeActionSection();
    },
  });

  state.isLoading = false;
}


// Helpers
function getDropdownBrokerOptionsFromConfigs(): DropdownBrokerOption[] {
  return Object.values(brokerConnectConfigs).map(({ id, name: brokerName }) => {
    const option: DropdownBrokerOption = { id, brokerName };
    const alreadyConnectedBroker: Broker | undefined = storeState.user.brokers.find(({ name }) => name === brokerName);

    if (alreadyConnectedBroker) {
      option.status = 'success';
      option.statusTooltip = 'Connected';
    }

    return option;
  });
}
</script>

<style lang="scss" scoped>
.p-button {
  margin-top: var(--sizes-space-default);
}
</style>
