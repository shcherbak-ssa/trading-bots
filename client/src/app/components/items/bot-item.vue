<template>
  <item-container v-if="selectedBot" :heading="selectedBot.name">
    <base-message v-if="storeGetters.isBrokerApiKeysExpired(selectedBot)" type="danger">
      You cannot activate the bot because the broker's API keys expired.
    </base-message>

    <group-container heading="Signals">
      <base-input
          label="Webhook url"
          type="text"
          icon="clone"
          :value="getWebhookUrl()"
          :disabled="true"
          :useIcon="true"
          @icon-click="copyToClipboard('Webhook url', getWebhookUrl())"
      />

      <base-input
          label="Bot token"
          type="text"
          icon="clone"
          :value="selectedBot.token"
          :disabled="true"
          :useIcon="true"
          @icon-click="copyToClipboard('Bot token', selectedBot.token)"
      />
    </group-container>

    <group-container heading="Settings">
      <div class="bot-settings">
        <div class="bot-settings-label">Broker</div>
        <div class="bot-settings-value">
          <broker-data-view type="broker" :brokerName="selectedBot.brokerName" />
        </div>

        <div class="bot-settings-label">Account</div>
        <div class="bot-settings-value">
          <broker-data-view
              type="account"
              :name="selectedBot.brokerAccount.name"
              :amount="selectedBot.brokerAccount.amount"
              :currency="selectedBot.brokerAccountCurrency"
          />
        </div>

        <div class="bot-settings-label">Market</div>
        <div class="bot-settings-value">
          <broker-data-view
              type="market"
              marketPlace="table"
              :name="selectedBot.brokerMarketName"
          />
        </div>

        <div class="bot-settings-label">Risk</div>
        <div class="bot-settings-value">
          <span>{{ selectedBot.tradeRiskPercent }} %</span>

          <span class="bot-settings-label">
            {{ calculateAmount(selectedBot.initialCapital, selectedBot.tradeRiskPercent) }}
          </span>
        </div>

        <div class="bot-settings-label">Max loss</div>
        <div class="bot-settings-value">
          <span>{{ selectedBot.tradeMaxLossPercent }} %</span>

          <span class="bot-settings-label">
            {{ calculateAmount(selectedBot.initialCapital, selectedBot.tradeMaxLossPercent) }}
          </span>
        </div>

        <div class="bot-settings-label">Capital use</div>
        <div class="bot-settings-value">
          <span>{{ selectedBot.tradeCapitalPercent }} %</span>

          <span class="bot-settings-label">
            {{ calculateAmount(selectedBot.initialCapital) }}
          </span>
        </div>

        <template v-if="selectedBot.tradeWithTakeProfit">
          <div class="bot-settings-label">Take profit</div>
          <div class="bot-settings-value">{{ selectedBot.tradeTakeProfitPL }} pl</div>
        </template>

        <template v-if="selectedBot.tradeWithCustomMarketLeverage">
          <div class="bot-settings-label">Custom leverage</div>
          <div class="bot-settings-value">{{ selectedBot.tradeCustomMarketLeverage }}</div>
        </template>

        <template v-if="selectedBot.positionCloseEnable">
          <div class="bot-settings-label">Positions close mode</div>
          <div class="bot-settings-value">{{ getPositionCloseModeLabel() }}</div>
        </template>

        <template v-if="selectedBot.restartEnable">
          <div class="bot-settings-label">Restart mode</div>
          <div class="bot-settings-value">{{ getRestartModeLabel() }}</div>
        </template>
      </div>
    </group-container>

    <group-container heading="Progress">
      <base-table
          v-if="selectedBot.progress && selectedBot.progress.length"
          class="base-table section"
          sortMode="single"
          sortField="botActivationIndex"
          :sortOrder="-1"
          :value="selectedBot.progress"
      >
        <base-table-column field="botActivationIndex" header="During">
          <template #body="{ data }">
            <span v-tooltip.bottom="getDuring(data.botActivationIndex).tooltip">
              {{ getDuring(data.botActivationIndex).label }}
            </span>
          </template>
        </base-table-column>

        <base-table-column field="totalFee" header="Fee">
          <template #body="{ data }">
            <span v-if="data.state === 'empty'">-</span>

            <span v-else :class="data.totalFee < 0 ? 'bot-progress-minus' : ''">
              {{ getNumberWithCurrency(data.totalFee) }}
            </span>
          </template>
        </base-table-column>

        <base-table-column field="totalLoss" header="Loss">
          <template #body="{ data }">
            <span v-if="data.state === 'empty'">-</span>

            <span v-else :class="data.totalLoss < 0 ? 'bot-progress-minus' : ''">
              {{ getNumberWithCurrency(data.totalLoss) }}
            </span>
          </template>
        </base-table-column>

        <base-table-column field="totalProfit" header="Profit">
          <template #body="{ data }">
            <span v-if="data.state === 'empty'">-</span>

            <span v-else :class="data.totalProfit > 0 ? 'bot-progress-plus' : ''">
              {{ getNumberWithCurrency(data.totalProfit) }}
            </span>
          </template>
        </base-table-column>

        <base-table-column field="totalResult" header="Result">
          <template #body="{ data }">
            <span v-if="data.state === 'empty'">-</span>

            <span v-else :class="getProgressClass(data.totalResult)">
              {{ getNumberWithCurrency(data.totalResult) }}
            </span>
          </template>
        </base-table-column>

        <base-table-column field="changePercent" header="Change">
          <template #body="{ data }">
            <span v-if="data.state === 'empty'">-</span>

            <span v-else :class="getProgressClass(data.changePercent)">
              {{ data.changePercent > 0 ? '+' : '' }}{{ data.changePercent }}%
            </span>
          </template>
        </base-table-column>
      </base-table>

      <div v-else>No data</div>
    </group-container>

    <div class="bot-status-panel flex-between">
      <div class="flex-align-center">
        <bot-status :bot="selectedBot" />

        <span class="bot-status-label">
          {{ getStatusLabel() }}
        </span>
      </div>

      <bot-action-buttons :bot="selectedBot" />
    </div>
  </item-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import {
  ServerEndpoint,
  BotState,
  BotDeactivateReason,
  FRACTION_DIGITS_TO_HUNDREDTHS,
  ONE_HUNDRED
} from 'global/constants';

import {
  calculateProportion,
  roundNumber,
  convertDateStringToNumber,
  getReadableDateString,
  getTodayDateString
} from 'global/utils';

import { botCreateSettings } from 'shared/config';
import { getCurrencySymbol, formDate } from 'shared/utils';

import { Notifications } from 'services/notifications';

import { Store, useStore } from 'app/store';


// Components
import ItemContainer from 'components/containers/item-container.vue';
import GroupContainer from 'components/containers/group-container.vue';
import BrokerDataView from 'components/broker-data-view.vue';
import BotActionButtons from 'components/bot-action-buttons.vue';
import BotStatus from 'components/bot-status.vue';


// Data
const { getters: storeGetters }: Store = useStore();

const selectedBot = computed(() => storeGetters.itemSectionSelectedBot);


// Methods
function getWebhookUrl(): string {
  return location.origin + ServerEndpoint.WEBHOOK_SIGNALS;
}

function copyToClipboard(label: string, value: string): void {
  if (!navigator.clipboard) {
    Notifications.showErrorNotification('Copy Failed', `Failed to copy to clipboard`);

    return;
  }

  navigator.clipboard.writeText(value)
    .then(() => {
      Notifications.showSuccessNotification('Copied', `${label} copied to clipboard`);
    })
    .catch(() => {
      Notifications.showErrorNotification('Copy Failed', `Failed to copy to clipboard`);
    });
}


// Settings
function getStatusLabel(): string {
  if (!selectedBot.value) return '';

  const { active, state, deactivateReason } = selectedBot.value;

  if (state === BotState.ARCHIVE) {
    return 'Archived';
  }

  if (active) {
    return 'Active';
  }

  let reason: string = '';

  switch (deactivateReason) {
    case BotDeactivateReason.USER:
      reason = 'User';
      break;
    case BotDeactivateReason.MAX_LOSS:
      reason = 'Max Loss';
      break;
    case BotDeactivateReason.INTERNAL_ERROR:
      reason = 'Bot Internal Error';
      break;
    case BotDeactivateReason.BROKER_API_KEYS_EXPIRED:
      reason = 'Broker API Keys Expired';
      break;
    default:
      reason = 'Created';
  }

  return `Inactive. Reason: ${reason}`;
}

function calculateAmount(from: number, percent: number = ONE_HUNDRED): string {
  if (!selectedBot.value) return '';

  return `${getAccountCurrencySymbol()}${roundNumber(calculateProportion(from, percent), FRACTION_DIGITS_TO_HUNDREDTHS)}`;
}

function getPositionCloseModeLabel(): string {
  return botCreateSettings.positionCloseMode.options
    .find(({ mode }) => {
      return mode === selectedBot.value?.positionCloseMode;
    })?.label || '';
}

function getRestartModeLabel(): string {
  return botCreateSettings.restartMode.options
    .find(({ mode }) => {
      return mode === selectedBot.value?.restartMode;
    })?.label || '';
}


// Table
function getDuring(activationIndex: number): { label: string, tooltip: string } {
  if (!selectedBot.value) return { label: '', tooltip: '' };

  const activation = selectedBot.value.activations.find((activation, index) => {
    return index === activationIndex;
  });

  if (activation) {
    const { start, end } = activation;

    const duringMilliseconds: number = convertDateStringToNumber(end) - convertDateStringToNumber(start);
    const startDateString: string = formDate(start);
    const endDateString: string = formDate(end);

    return {
      label: getReadableDateString(duringMilliseconds),
      tooltip: startDateString === endDateString ? endDateString : `${startDateString} - ${endDateString}`,
    };
  }

  const { activateAt } = selectedBot.value;
  const activateDateString: string = formDate(activateAt);
  const today: string = formDate(getTodayDateString());

  return {
    label: getReadableDateString(Date.now() - convertDateStringToNumber(activateAt)),
    tooltip: activateDateString === today ? 'Today' : `${activateDateString} - Today`,
  };
}

function getNumberWithCurrency(num: number): string {
  if (num === 0 || !selectedBot.value) return '0';

  const prefix: string = num < 0 ? '-' : '+';

  return `${prefix}${getAccountCurrencySymbol()}${Math.abs(num)}`;
}

function getProgressClass(num: number): string {
  if (num === 0) return '';

  return num < 0 ? 'bot-progress-minus' : 'bot-progress-plus';
}


// Helpers
function getAccountCurrencySymbol(): string {
  return getCurrencySymbol(selectedBot.value?.brokerAccountCurrency || '');
}
</script>

<style lang="scss" scoped>
.bot-status-panel {
  background: var(--colors-background-section);
  position: sticky;
  bottom: 0;
  padding: 5px;
}

.bot-status-label {
  font-size: 0.89rem;
  opacity: .7;
  margin-left: 10px;
}

.bot-settings {
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr;
  gap: 15px 30px;
}

.bot-settings-label {
  font-size: 0.79rem;
  opacity: .7;
}

.bot-settings-value {
  font: 400 14.22px/19px 'DM Sans';

  .bot-settings-label {
    margin-left: 10px;
  }
}

.bot-progress-plus {
  color: var(--colors-accent);
}

.bot-progress-minus {
  color: var(--colors-secondary);
}
</style>
