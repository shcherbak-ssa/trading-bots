<template>
  <item-container v-if="selectedBot" :heading="selectedBot.name">
    <div class="bot-status-panel flex-between">
      <div class="flex-align-center">
        <bot-status :bot="selectedBot" />

        <span v-if="!selectedBot.active" class="bot-deactivation-reason">
          Reason: {{ selectedBot.deactivateReason }}
        </span>
      </div>

      <bot-action-buttons :bot="selectedBot" />
    </div>

    <base-message v-if="storeGetters.isBrokerApiKeysExpired(selectedBot)" type="danger">
      You cannot activate the bot because the broker's API keys expired.
    </base-message>

    <group-container heading="Token">
      // @TODO: refactor
      {{ selectedBot.token }}
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
        <div class="bot-settings-value">{{ selectedBot.tradeRiskPercent }} %</div>

        <div class="bot-settings-label">Max loss</div>
        <div class="bot-settings-value">{{ selectedBot.tradeMaxLossPercent }} %</div>

        <div class="bot-settings-label">Capital use</div>
        <div class="bot-settings-value">{{ selectedBot.tradeCapitalPercent }} %</div>

        <template v-if="selectedBot.tradeWithTakeProfit">
          <div class="bot-settings-label">Take profit</div>
          <div class="bot-settings-value">{{ selectedBot.tradeTakeProfitPL }} pl</div>
        </template>

        <template v-if="selectedBot.tradeWithCustomMarketLeverage">
          <div class="bot-settings-label">Custom leverage</div>
          <div class="bot-settings-value">{{ selectedBot.tradeCustomMarketLeverage }}</div>
        </template>

        <div class="bot-settings-label">Close positions</div>
        <div class="bot-settings-value">-</div>
      </div>
    </group-container>

    <group-container heading="Progress">
      @TODO
    </group-container>
  </item-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { BotClientInfo } from 'global/types';

import { Store, useStore } from 'app/store';


// Components
import ItemContainer from 'components/containers/item-container.vue';
import GroupContainer from 'components/containers/group-container.vue';
import BrokerDataView from 'components/broker-data-view.vue';
import BotActionButtons from 'components/bot-action-buttons.vue';
import BotStatus from 'components/bot-status.vue';


// Types

// Data
const { state: storeState, getters: storeGetters }: Store = useStore();

const selectedBot = computed(() => storeGetters.itemSectionSelectedBot);

// Methods
</script>

<style lang="scss" scoped>
.bot-status-panel {
  background: var(--colors-background-section);
  padding: 5px;
  margin-bottom: 20px;
}

.bot-deactivation-reason {
  font-size: 0.89rem;
  opacity: .7;
  margin-left: 10px;
}

.bot-settings {
  display: grid;
  align-items: center;
  grid-template-columns: 100px 1fr;
  gap: 15px 30px;
}

.bot-settings-label {
  font-size: 0.79rem;
  opacity: .7;
}

.bot-settings-value {
  font: 400 14.22px/19px 'DM Sans';
}
</style>
