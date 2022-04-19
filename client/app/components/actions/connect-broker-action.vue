<template>
  <action-section-container title="Connect Broker">
    <base-dropdown
        v-model="state.selectedBroker"
        :options="brokerList"
        class="input-container brokers-dropdown"
        placeholder="Select broker"
        @change="selectUpdated"
    >
      <template #value="{ value, placeholder }">
        <div class="dropdown-value" v-if="value">
          <img class="input-icon" :src="value.logo" />
          <span>{{ value.label }}</span>
        </div>
        <span v-else class="input-placeholder">
          {{ placeholder }}
        </span>
      </template>

      <template #option="{ option }">
        <div class="dropdown-option flex-between">
          <div class="flex-align-center">
            <img class="input-icon" :src="option.logo" />
            <span>{{ option.label }}</span>
          </div>
        </div>
      </template>
    </base-dropdown>

    <base-message-box
        v-if="state.errorMessage"
        class="message"
        type="error"
    >
      <div v-html="state.errorMessage" />
    </base-message-box>

    <template v-if="state.selectedBroker !== null">
      <base-input
          v-for="input in state.selectedBroker.inputs"
          :key="state.selectedBroker.name + '-' + input.key"
          :label="input.label"
          :value="state.inputs[input.key].value"
          :helpText="state.inputs[input.key].helpText"
          :isError="state.inputs[input.key].isError"
          :type="input.type"
          @input="(value) => state.inputs[input.key].value = value"
      />

      <base-button
          class="block"
          buttonLabel="Connect"
          :isLoading="state.isLoading"
          @click="connectBroker"
      />
    </template>
  </action-section-container>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import type { Broker, InputState } from 'shared/types';
import { ActionType, StoreMutation } from 'shared/constants';
import { brokerList } from 'shared/content';
import { runAction } from 'shared/actions';
import { getInitialInputState, getInputValues, resetInputsState } from 'shared/utils';

import { Store, useStore } from 'app/store';


// Components
import ActionSectionContainer from "components/action-section-container.vue";
import BaseMessageBox from 'components/base/base-message-box.vue';


// Types
type ComponentState = {
  isLoading: boolean;
  selectedBroker: Broker | null;
  inputs: { [p: string]: InputState; };
  errorMessage: string;
}


// Data
const { state: storeState, commit }: Store = useStore();

const state = reactive<ComponentState>({
  isLoading: false,
  selectedBroker: null,
  inputs: {},
  errorMessage: '',
});


// Methods
function selectUpdated(): void {
  if (state.selectedBroker === null) return;

  state.inputs = {};

  for (const { key, type } of state.selectedBroker.inputs) {
    state.inputs[key] = getInitialInputState(type);
  }
}

async function connectBroker(): Promise<void> {
  const { selectedBroker, inputs } = state;

  if (selectedBroker === null) return;

  resetInputsState(inputs, ['value']);
  state.errorMessage = '';

  if (!isInputValuesValid()) return;

  state.isLoading = true;

  const { expiresDate, ...apiKeys } = getInputValues(inputs);

  await runAction({
    type: ActionType.BROKERS_CONNECT,
    payload: {
      name: selectedBroker.name,
      expiresDate,
      apiKeys,
    },
  });

  const errors = storeState.errors[ActionType.BROKERS_CONNECT];

  if (errors) {
    state.errorMessage = errors.map(({ message }) => message).join('<br>');

    commit({
      type: StoreMutation.REMOVE_ERROR,
      key: ActionType.BROKERS_CONNECT,
    });
  } else {
    commit({
      type: StoreMutation.CLOSE_ACTION_SECTION,
    });
  }

  state.isLoading = false;
}

function isInputValuesValid(): boolean {
  let isValid: boolean = true;

  for (const [key, { value }] of Object.entries(state.inputs)) {
    if (value === null || typeof value === 'string' && value.trim() === '') {
      state.inputs[key].helpText = 'Field cannot be empty';
      state.inputs[key].isError = true;

      isValid = false;
    }
  }

  return isValid;
}
</script>

<style lang="scss" scoped>
.brokers-dropdown {
  margin-bottom: var(--sizes-space-default);
}

.p-button {
  margin-top: var(--sizes-space-default);
}

.message {
  margin-bottom: 30px;
}
</style>
