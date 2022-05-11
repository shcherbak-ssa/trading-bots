<template>
  <action-container :heading="storeGetters.isBotSelected ? 'Edit bot' : 'Create bot'">
    <template v-if="state.isLoading">
      <base-skeleton style="width: 37px; margin-bottom: 8px" />
      <base-skeleton class="input" />
    </template>

    <template v-else>
      <base-input
          label="Name"
          type="text"
          class="input-bot-name"
          placeholder="Enter bot name"
          :value="state.bot.name"
          :validation="v$.bot.name"
          @input="(value) => state.bot.name = value"
      />

      <group-container heading="Broker">
        <broker-dropdown
            :value="state.selectedBrokerOption"
            :isLoading="state.isBrokersLoading"
            :options="storeGetters.brokersDropdownOptions"
            :validation="v$.bot.brokerId"
            :disabled="storeGetters.isBotSelected"
            @select="selectBroker"
        />

        <base-dropdown
            label="Account"
            placeholder="Select account"
            loadingPlaceholder="Accounts loading..."
            optionLabel="name"
            optionGroupLabel="label"
            optionGroupChildren="items"
            emptyMessage="Please, select broker"
            :value="state.selectedBrokerAccountOption"
            :options="storeGetters.brokerAccountsDropdownOptions"
            :isLoading="state.isAccountsLoading"
            :validation="v$.bot.brokerAccountId"
            :disabled="storeGetters.isBotSelected"
            @select="selectAccount"
        >
          <template #value="{ value }">
            <broker-data-view
                type="account"
                :name="value.name"
                :currency="value.currency"
                :amount="value.amount"
            />
          </template>

          <template #option="{ option }">
            <broker-data-view
                type="account"
                :name="option.name"
                :currency="option.currency"
                :amount="option.amount"
            />
          </template>
        </base-dropdown>

        <base-dropdown
            label="Market"
            placeholder="Select market"
            loadingPlaceholder="Markets loading..."
            optionLabel="name"
            :value="state.selectedBrokerMarketOption"
            :options="storeGetters.brokerMarketsDropdownOptions"
            :isLoading="state.isMarketsLoading"
            :emptyMessage="!state.bot.brokerId ? 'Please, select broker and account' : 'Please, select account'"
            :filter="!!storeGetters.brokerMarketsDropdownOptions.length"
            :validation="v$.bot.brokerMarketSymbol"
            :disabled="storeGetters.isBotSelected"
            @select="selectMarker"
        >
          <template #value="{ value }">
            <div>{{ value.name }}</div>
          </template>

          <template #option="{ option }">
            <broker-data-view
                type="market"
                marketPlace="option"
                :name="option.name"
            />
          </template>
        </base-dropdown>
      </group-container>

      <group-container heading="Trading">
        <base-input
            v-bind="botCreateSettings.riskInput"
            :value="state.bot.tradeRiskPercent"
            @input="(value) => state.bot.tradeRiskPercent = value"
        />

        <base-input
            v-bind="botCreateSettings.maxLossInput"
            :value="state.bot.tradeMaxLossPercent"
            @input="(value) => state.bot.tradeMaxLossPercent = value"
        />

        <base-input
            v-bind="botCreateSettings.capitalInput"
            :value="state.bot.tradeCapitalPercent"
            :validation="v$.bot.tradeCapitalPercent"
            :helpText="capitalInputHelpText"
            :disabled="true"
            :useButton="true"
        >
          <template #button>
            <base-button
                class="block"
                buttonLabel="Configure"
                @click="toggleCapitalConfig"
            />
          </template>
        </base-input>

        <prime-vue-overlay-panel ref="capitalConfig">
          <div class="capital-container">
            <template v-if="Object.keys(state.capitalInputStates).length">
              <base-input
                  v-for="stateKey in Object.keys(state.capitalInputStates)"
                  v-bind="botCreateSettings.capitalPanelInput"
                  :key="stateKey"
                  :label="state.capitalInputStates[stateKey].label"
                  :value="state.capitalInputStates[stateKey].value"
                  :numberMax="capitalInputNumberMax"
                  @input="(value) => state.capitalInputStates[stateKey].value = value"
              />

              <div
                  class="capital-message"
                  :class="isAllowedCapitalInputValueTotal ? '' : 'is-error'"
              >
                The maximum allowed value is {{ botDefaultSettings.tradeCapitalPercent.max }}%.
                Current - {{ capitalInputValueTotal }}%
              </div>

              <div class="capital-buttons-group flex">
                <base-button
                    class="secondary block"
                    buttonLabel="Cancel"
                    @click="cancelCapitalConfig"
                />
                <base-button
                    class="block"
                    buttonLabel="Apply"
                    :disabled="!isAllowedCapitalInputValueTotal"
                    @click="applyCapitalConfig"
                />
              </div>
            </template>

            <div v-else>
              Please, select broker account
            </div>
          </div>
        </prime-vue-overlay-panel>

        <base-checkbox
            label="Use take profit"
            checkboxId="use-take-profit"
            :value="state.bot.tradeWithTakeProfit"
            @change="(value) => state.bot.tradeWithTakeProfit = value"
        />

        <base-input
            v-if="state.bot.tradeWithTakeProfit"
            v-bind="botCreateSettings.takeProfitInput"
            :value="state.bot.tradeTakeProfitPL"
            @input="(value) => state.bot.tradeTakeProfitPL = value"
        />

        <template v-if="state.botConfig && state.botConfig.allowLeverageSettings">
          <base-checkbox
              label="Use custom leverage"
              checkboxId="use-custom-leverage"
              :value="state.bot.tradeWithCustomMarketLeverage"
              @change="(value) => state.bot.tradeWithCustomMarketLeverage = value"
          />

          <base-dropdown
              v-if="state.bot.tradeWithCustomMarketLeverage"
              label="Market leverage"
              placeholder="Select leverage"
              loadingPlaceholder="Market leverages loading..."
              optionLabel="value"
              emptyMessage="Please, select broker market"
              :value="state.selectedBrokerMarketLeverageOption"
              :options="storeGetters.brokerMarketLeverageDropdownOptions"
              :isLoading="state.isMarketLeveragesLoading"
              @select="selectMarketLeverage"
          >
            <template #value="{ value }">
              <div>{{ value.value }}</div>
            </template>

            <template #option="{ option }">
              <div>{{ option.value }}</div>
            </template>
          </base-dropdown>
        </template>

        <base-checkbox
            label="Enable position closing mode"
            checkboxId="position-close"
            :value="state.bot.positionCloseEnable"
            @change="(value) => state.bot.positionCloseEnable = value"
        />

        <base-dropdown
            v-if="state.bot.positionCloseEnable"
            label="Position closing mode"
            placeholder="Select position closing mode"
            optionLabel="label"
            :value="state.selectedPositionCloseMode"
            :options="botCreateSettings.positionCloseMode.options"
            :validation="v$.bot.positionCloseMode"
            @select="selectPositionCloseMode"
        >
          <template #value="{ value }">
            <div>{{ value.label }}</div>
          </template>

          <template #option="{ option }">
            <div>{{ option.label }}</div>
          </template>
        </base-dropdown>
      </group-container>

      <group-container heading="Restart">
        <base-checkbox
            label="Enable restart"
            checkboxId="restart-bot"
            :value="state.bot.restartEnable"
            @change="(value) => state.bot.restartEnable = value"
        />

        <base-dropdown
            v-if="state.bot.restartEnable"
            label="Restart mode"
            placeholder="Select restart mode"
            optionLabel="label"
            :value="state.selectedRestartMode"
            :options="botCreateSettings.restartMode.options"
            :validation="v$.bot.restartMode"
            :helpText="botCreateSettings.restartMode.helpText"
            @select="selectRestartMode"
        >
          <template #value="{ value }">
            <div>{{ value.label }}</div>
          </template>

          <template #option="{ option }">
            <div>{{ option.label }}</div>
          </template>
        </base-dropdown>

        <base-message type="info">
          Restart need to reset your bot progress.
        </base-message>
      </group-container>

      <group-container :heading="storeGetters.isBotSelected ? 'Update' : 'Creation'">
        <base-checkbox
            v-if="!storeGetters.isBotSelected"
            label="Activate bot after creation"
            checkboxId="activate-bot"
            :value="state.bot.active"
            @change="(value) => state.bot.active = value"
        />

        <base-message
            v-if="botUpdates !== null && state.bot.active"
            :type="isUpdatedImportantSettings ? 'danger' : 'info'"
        >
          <span v-if="isUpdatedImportantSettings">
            You updated important settings. After the update, the bot will restart.
            Open position will be closed and progress will be reset.
          </span>

          <span v-else>
            After the update, the bot will restart without resetting progress.
          </span>
        </base-message>

        <base-message v-if="otherBotsForUpdate.length" type="danger">
          You updated other bots ({{ otherBotsForUpdate.length }}).
          They will be restarted and their open positions will be closed if they are active.
        </base-message>

        <base-button
            class="block"
            :buttonLabel="storeGetters.isBotSelected ? 'Update' : 'Create'"
            :isLoading="state.isCreationProcessing"
            :disabled="storeGetters.isBotSelected && botUpdates === null"
            @click="runBotAction"
        />
      </group-container>
    </template>
  </action-container>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { minValue, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';

import type { BotClientInfo, BrokerAccount, BrokerMarket, GetBrokerDataPayload, UpdateBotPayload } from 'global/types';
import { BotRestartMode, BotState, BotUpdateType, BrokerDataType, BotPositionCloseMode } from 'global/constants';
import { botDefaultSettings } from 'global/config';

import type {
  BotActionState,
  BotCreateConfig,
  BotUpdatePayload,
  DropdownBrokerOption,
  DropdownRestartModeOption,
  DropdownPositionCloseModeOption
} from 'shared/types';

import { ActionType, StoreMutation } from 'shared/constants';
import { botCreateConfigs, botCreateSettings, initialBotActionState } from 'shared/config';

import { Notifications } from 'services/notifications';
import { runAction } from 'services/actions';

import { useCloseActionSection, useLoadBrokers } from 'app/hooks';
import { Store, useStore } from 'app/store';


// Components
import ActionContainer from 'components/containers/action-container.vue';
import GroupContainer from 'components/containers/group-container.vue';
import BrokerDropdown from 'components/broker-dropdown.vue';
import BrokerDataView from 'components/broker-data-view.vue';
import PrimeVueOverlayPanel from 'primevue/overlaypanel';


// Types
type ComponentState = {
  isLoading: boolean;
  isBrokersLoading: boolean;
  isAccountsLoading: boolean;
  isMarketsLoading: boolean;
  isMarketLeveragesLoading: boolean;
  isCreationProcessing: boolean;
  capitalInputStates: {
    [p: string]: {
      label: string;
      name: string;
      value: number;
      prevValue: number;
      initialValue: number;
    }
  };
  capitalReserved: number;
  capitalReservedBotsCount: number;
  selectedBrokerOption: DropdownBrokerOption | null;
  selectedBrokerAccountOption: BrokerAccount | BotClientInfo['brokerAccount'] | null;
  selectedBrokerMarketOption: BrokerMarket | null;
  selectedBrokerMarketLeverageOption: { value: string } | null;
  selectedRestartMode: DropdownRestartModeOption | null;
  selectedPositionCloseMode: DropdownPositionCloseModeOption | null;
  botConfig: BotCreateConfig | null;
  bot: BotActionState;
}


// Data
const CAPITAL_INPUT_STATE_KEY = 'current';

const { state: storeState, getters: storeGetters, commit }: Store = useStore();

const loadBrokers = useLoadBrokers(false);
const closeActionSection = useCloseActionSection();

const capitalConfig = ref();

const state = reactive<ComponentState>({
  isLoading: false,
  isBrokersLoading: true,
  isAccountsLoading: false,
  isMarketsLoading: false,
  isMarketLeveragesLoading: false,
  isCreationProcessing: false,
  capitalInputStates: {},
  capitalReserved: 0,
  capitalReservedBotsCount: 0,
  selectedBrokerOption: null,
  selectedBrokerAccountOption: null,
  selectedBrokerMarketOption: null,
  selectedBrokerMarketLeverageOption: null,
  selectedRestartMode: null,
  selectedPositionCloseMode: null,
  botConfig: null,
  bot: { ...initialBotActionState },
});

const botUpdates = computed<UpdateBotPayload['updates'] | null>(() => {
  const { selectedBot } = storeState.actionSection;

  if (!selectedBot) return null;

  const updates: UpdateBotPayload['updates'] = {};

  for (const [key, value] of Object.entries(state.bot)) {
    // @ts-ignore
    if (selectedBot[key] !== value) {
      // @ts-ignore
      updates[key] = value;
    }
  }

  return Object.keys(updates).length ? updates : null;
});

const capitalInputHelpText = computed<string>(() => {
  const { capitalReserved, capitalReservedBotsCount } = state;

  return capitalReserved === 0
    ? ''
    : `${capitalReserved}% reserved by other bots (${capitalReservedBotsCount}) on this broker account`;
});

const capitalInputNumberMax = computed<number>(() => {
  const { min, max } = botDefaultSettings.tradeCapitalPercent;

  return max - min * (Object.keys(state.capitalInputStates).length - 1);
});

const capitalInputValueTotal = computed<number>(() => {
  return Object.values(state.capitalInputStates).reduce((total, { value }) => {
    return total + value;
  }, 0);
});

const isAllowedCapitalInputValueTotal = computed<boolean>(() => {
  return capitalInputValueTotal.value <= botDefaultSettings.tradeCapitalPercent.max
});

const isUpdatedImportantSettings = computed<boolean>(() => {
  if (!botUpdates.value) return false;

  const { tradeMaxLossPercent, tradeCapitalPercent } = botUpdates.value;

  return tradeMaxLossPercent !== undefined || tradeCapitalPercent !== undefined;
});

const otherBotsForUpdate = computed<BotUpdatePayload[]>(() => {
  return Object.entries(state.capitalInputStates)
    .filter(([botId, value]) => {
      return botId !== CAPITAL_INPUT_STATE_KEY && value.value !== value.initialValue;
    })
    .map(([botId, value]) => {
      return {
        id: botId,
        type: BotUpdateType.UPDATE,
        botName: value.name,
        updates: {
          tradeCapitalPercent: value.value,
        },
      };
    });
});

const validationRules = computed(() => {
  const rules = {
    bot: {
      name: { required },
      brokerId: { required },
      brokerAccountId: { required },
      brokerMarketSymbol: { required },
      tradeCapitalPercent: {
        minValue: minValue(botDefaultSettings.tradeCapitalPercent.min),
      },
      restartMode: {},
      positionCloseMode: {}
    },
  };

  if (state.bot.restartEnable) {
    rules.bot.restartMode = {
      required: (value: string) => value !== '' && value !== BotRestartMode.NONE,
    };
  }

  if (state.bot.positionCloseEnable) {
    rules.bot.positionCloseMode = {
      required: (value: string) => value !== '' && value !== BotPositionCloseMode.NONE,
    };
  }

  return rules;
});

const v$ = useVuelidate(validationRules, state);


// Hooks
onMounted(async () => {
  if (storeState.actionSection.selectedBot) {
    state.isLoading = true;
  }

  await loadBrokers();
  await setBrokerDataForCurrentBot();

  state.isBrokersLoading = false;
});


// Fetch
async function setBrokerDataForCurrentBot(): Promise<void> {
  const { selectedBot } = storeState.actionSection;

  if (!selectedBot) return;

  const { id, createdAt, brokerAccount, ...actionState } = selectedBot;
  const { brokerId, brokerName, brokerAccountId, brokerAccountType, brokerMarketName, brokerMarketSymbol } = actionState;

  state.selectedBrokerOption = { id: brokerId, brokerName };

  selectBroker(state.selectedBrokerOption, false);

  if (brokerAccount) {
    state.selectedBrokerAccountOption = brokerAccount;
  } else {
    await loadBrokerAccounts();

    state.selectedBrokerAccountOption = storeGetters.brokerAccountsDropdownOptions
      .find(({ label }) => label === brokerAccountType)
      ?.items
      .find(({ accountId }) => accountId === brokerAccountId) || null;
  }

  state.selectedBrokerMarketOption = {
    name: brokerMarketName,
    symbol: brokerMarketSymbol,
    currency: '',
  };

  if (state.botConfig?.allowLeverageSettings) {
    await loadBrokerMarketLeverages(brokerMarketSymbol);
    state.selectedBrokerMarketLeverageOption = { value: actionState.tradeCustomMarketLeverage.toString() };
  }

  if (selectedBot.restartEnable) {
    const selectedRestartModeOption: DropdownRestartModeOption | undefined
      = botCreateSettings.restartMode.options.find(({ mode }) => mode === selectedBot.restartMode);

    if (selectedRestartModeOption) {
      state.selectedRestartMode = selectedRestartModeOption;
    }
  }

  if (selectedBot.positionCloseEnable) {
    const selectedPositionCloseMode: DropdownPositionCloseModeOption | undefined
      = botCreateSettings.positionCloseMode.options.find(({ mode }) => mode === selectedBot.positionCloseMode);

    if (selectedPositionCloseMode) {
      state.selectedPositionCloseMode = selectedPositionCloseMode;
    }
  }

  state.bot = { ...actionState };
  updateCapitalData();

  state.isLoading = false;
}

async function loadBrokerAccounts(): Promise<void> {
  if (!state.botConfig) return;

  state.isAccountsLoading = true;

  await runAction<GetBrokerDataPayload>({
    type: ActionType.BROKERS_GET_DATA,
    payload: {
      id: state.bot.brokerId,
      dataType: BrokerDataType.ACCOUNT,
      allowDemoAccount: state.botConfig.allowDemoAccount,
    },
  });

  state.isAccountsLoading = false;
}

async function loadBrokerMarkets(accountCurrency: string): Promise<void> {
  state.isMarketsLoading = true;

  await runAction<GetBrokerDataPayload>({
    type: ActionType.BROKERS_GET_DATA,
    payload: {
      id: state.bot.brokerId,
      dataType: BrokerDataType.MARKET,
      accountType: state.bot.brokerAccountType,
      accountCurrency,
    },
  });

  state.isMarketsLoading = false;
}

async function loadBrokerMarketLeverages(marketSymbol: string): Promise<void> {
  state.isMarketLeveragesLoading = true;

  await runAction<GetBrokerDataPayload>({
    type: ActionType.BROKERS_GET_DATA,
    payload: {
      id: state.bot.brokerId,
      dataType: BrokerDataType.MARKET_LEVERAGE,
      marketSymbol,
    },
  });

  const { selectedBot } = storeState.actionSection;

  if (!selectedBot) {
    const { current: currentLeverage } = storeState.broker.marketLeverage;

    state.bot.tradeCustomMarketLeverage = currentLeverage;
    state.selectedBrokerMarketLeverageOption = { value: currentLeverage.toString() };
  }

  state.isMarketLeveragesLoading = false;
}


// Methods
function selectBroker(brokerOption: DropdownBrokerOption, loadAccounts: boolean = true): void {
  if (!brokerOption || state.bot.brokerId === brokerOption.id) return;

  const selectedBroker = storeGetters.getUserBroker(brokerOption.id);

  state.botConfig = botCreateConfigs[selectedBroker.name];

  state.selectedBrokerOption = brokerOption;
  state.selectedBrokerAccountOption = null;
  state.selectedBrokerMarketOption = null;
  state.selectedBrokerMarketLeverageOption = null;

  state.bot.brokerId = brokerOption.id;
  state.bot.brokerName = selectedBroker.name;
  state.bot.brokerAccountId = '';
  state.bot.brokerMarketSymbol = '';

  commit({
    type: StoreMutation.BROKER_RESET,
  });

  if (loadAccounts) {
    loadBrokerAccounts();
  }
}

function selectAccount(account: BrokerAccount): void {
  if (state.bot.brokerAccountId === account.accountId) return;

  commit({
    type: StoreMutation.BROKER_RESET,
    dataTypes: [BrokerDataType.MARKET, BrokerDataType.MARKET_LEVERAGE],
  });

  state.selectedBrokerAccountOption = account;
  state.selectedBrokerMarketOption = null;
  state.selectedBrokerMarketLeverageOption = null;

  state.bot.brokerAccountId = account.accountId;
  state.bot.brokerAccountType = account.type;
  state.bot.brokerAccountCurrency = account.currency;
  state.bot.brokerMarketSymbol = '';

  updateCapitalData();
  loadBrokerMarkets(account.currency);
}

function selectMarker(market: BrokerMarket): void {
  commit({
    type: StoreMutation.BROKER_RESET,
    dataTypes: [BrokerDataType.MARKET_LEVERAGE],
  });

  state.selectedBrokerMarketOption = market;
  state.selectedBrokerMarketLeverageOption = null;

  state.bot.brokerMarketSymbol = market.symbol;
  state.bot.brokerMarketName = market.name;

  if (state.botConfig?.allowLeverageSettings) {
    loadBrokerMarketLeverages(market.symbol);
  }
}

function selectMarketLeverage(option: { value: string }): void {
  state.selectedBrokerMarketLeverageOption = option;

  state.bot.tradeCustomMarketLeverage = Number(option.value);
}

function selectRestartMode(option: DropdownRestartModeOption): void {
  state.bot.restartMode = option.mode;

  state.selectedRestartMode = option;
}

function selectPositionCloseMode(option: DropdownPositionCloseModeOption): void {
  state.bot.positionCloseMode = option.mode;

  state.selectedPositionCloseMode = option;
}

function toggleCapitalConfig(e: Event): void {
  capitalConfig.value.toggle(e);
}

function cancelCapitalConfig(): void {
  capitalConfig.value.hide();

  for (const value of Object.values(state.capitalInputStates)) {
    value.value = value.prevValue;
  }
}

function applyCapitalConfig(): void {
  capitalConfig.value.hide();

  state.capitalReserved = 0;
  state.capitalReservedBotsCount = 0;

  for (const [inputKey, inputState] of Object.entries(state.capitalInputStates)) {
    inputState.prevValue = inputState.value;

    if (inputKey === CAPITAL_INPUT_STATE_KEY) {
      state.bot.tradeCapitalPercent = inputState.value;
    } else {
      state.capitalReserved += inputState.value;
      state.capitalReservedBotsCount += 1;
    }
  }
}

async function runBotAction(): Promise<void> {
  v$.value.$reset();
  const isInputsValid: boolean = await v$.value.$validate();

  if (!isInputsValid) {
    Notifications.showErrorNotification(`Validation error`, `Please, enter the data correctly`);

    return;
  }

  state.isCreationProcessing = true;

  const { selectedBot } = storeState.actionSection;

  const actionCallbacks = {
    callback: () => {
      updateOtherBots();
    },
    errorCallback: () => {
      state.isCreationProcessing = false;
    },
  };

  if (selectedBot && botUpdates.value) {
    await runAction<BotUpdatePayload>({
      type: ActionType.BOTS_UPDATE,
      payload: {
        id: selectedBot.id,
        type: BotUpdateType.UPDATE,
        botName: selectedBot.name,
        updates: botUpdates.value,
      },
      ...actionCallbacks,
    });
  } else {
    await runAction<BotActionState>({
      type: ActionType.BOTS_CREATE,
      payload: { ...state.bot },
      ...actionCallbacks,
    });
  }
}

async function updateOtherBots(): Promise<void> {
  await Promise.all(
    otherBotsForUpdate.value.map(async (payload) => {
      return runAction({
        type: ActionType.BOTS_UPDATE,
        payload,
      });
    })
  );

  state.isCreationProcessing = false;

  closeActionSection();
}


// Helpers
function updateCapitalData(): void {
  const { brokerName: accountBrokerName, brokerAccountId: accountId } = state.bot;
  const { selectedBot } = storeState.actionSection;

  const selectedBotId: string = selectedBot ? selectedBot.id : '';

  state.capitalReserved = 0;
  state.capitalReservedBotsCount = 0;

  const initialCapitalValue: number = selectedBot
    ? selectedBot.tradeCapitalPercent
    : botDefaultSettings.tradeCapitalPercent.max;

  state.capitalInputStates = {
    [CAPITAL_INPUT_STATE_KEY]: {
      label: 'Current bot',
      name: '',
      value: initialCapitalValue,
      prevValue: initialCapitalValue,
      initialValue: initialCapitalValue,
    },
  };

  for (const { id, name, state: botState, brokerName, brokerAccountId, tradeCapitalPercent } of storeState.user.bots) {
    if (selectedBotId === id || botState === BotState.ARCHIVE) {
      continue;
    }

    if (accountBrokerName === brokerName && accountId === brokerAccountId) {
      state.capitalReserved += tradeCapitalPercent;
      state.capitalReservedBotsCount += 1;

      if (!selectedBot) {
        state.capitalInputStates[CAPITAL_INPUT_STATE_KEY].value -= tradeCapitalPercent;
        state.capitalInputStates[CAPITAL_INPUT_STATE_KEY].prevValue -= tradeCapitalPercent;
      }

      state.capitalInputStates = {
        ...state.capitalInputStates,
        [id]: {
          name,
          label: `Bot "${name}"`,
          value: tradeCapitalPercent,
          prevValue: tradeCapitalPercent,
          initialValue: tradeCapitalPercent,
        },
      };
    }
  }

  state.bot.tradeCapitalPercent = state.capitalInputStates[CAPITAL_INPUT_STATE_KEY].value;
}
</script>

<style lang="scss" scoped>
.input-bot-name {
  margin-bottom: 40px;
}

.capital {
  &-container {
    width: 310px;
  }

  &-buttons-group {
    gap: 20px;
  }

  &-message {
    text-align: center;
    margin-bottom: 20px;

    &.is-error {
      color: var(--colors-secondary);
    }
  }
}
</style>
