<template>
  <page-container heading="Bots">
    <template v-slot:actions>
      <base-skeleton v-if="state.isLoading" class="button-circle" />

      <base-button
          v-else-if="bots.length || brokers.length"
          :disabled="storeState.actionSection.isActive"
          @click="createBot"
      >
        <base-icon type="pi" icon="plus" />
        <div class="button-label">Create bot</div>
      </base-button>
    </template>

    <div class="bots-container full">
      <div v-if="state.isLoading">
        <div class="bots-table-header-skeleton flex">
          <base-skeleton style="width: 15%;" />
          <base-skeleton style="width: 25%;" />
          <base-skeleton style="width: 10%;" />
        </div>
        <base-skeleton class="bots-item-skeleton" />
        <base-skeleton class="bots-item-skeleton" />
      </div>

      <template v-else-if="bots.length">
        <base-scroll-panel class="full">
          <base-table
              v-if="bots.length"
              class="base-table bots-table page"
              selectionMode="single"
              rowGroupMode="subheader"
              groupRowsBy="state"
              dataKey="id"
              sortMode="single"
              sortField="state"
              :sortOrder="1"
              :selection="state.selectedBot"
              :value="bots"
              :metaKeySelection="false"
              @row-select="selectBot"
              @row-unselect="unselectBot"
          >
            <template #groupheader="{ data }">
              <div>{{ data.state }}</div>
            </template>

            <base-table-column class="bot-active-status" field="active" header="">
              <template #body="{ data }">
                <bot-status :bot="data" />
              </template>
            </base-table-column>

            <base-table-column field="name" header="Name">
              <template #body="{ data }">
                <div class="bot-name">{{ data.name }}</div>
              </template>
            </base-table-column>

            <base-table-column field="brokerName" header="Broker">
              <template #body="{ data }">
                <broker-data-view type="broker" :brokerName="data.brokerName" />
              </template>
            </base-table-column>

            <base-table-column
                v-if="!storeState.itemSection.isActive"
                field="brokerAccount"
                header="Account"
            >
              <template #body="{ data }">
                <broker-data-view
                    type="account"
                    :name="data.brokerAccount.name"
                    :currency="data.brokerAccountCurrency"
                    :amount="data.brokerAccount.amount"
                />
              </template>
            </base-table-column>

            <base-table-column field="brokerMarketName" header="Market">
              <template #body="{ data }">
                <broker-data-view
                    type="market"
                    marketPlace="table"
                    :name="data.brokerMarketName"
                />
              </template>
            </base-table-column>

            <base-table-column field="progress" header="Progress">
              <template #body="{ data }">
                <base-status
                    v-if="data.state === BotState.ARCHIVE"
                    status="neutral"
                    :label="`+${getCurrencySymbol(data.brokerAccountCurrency)}210`"
                    tooltip="Income (TODO)"
                />

                <base-status
                    v-else-if="data.active"
                    status="success"
                    :label="`+${getCurrencySymbol(data.brokerAccountCurrency)}120 (10%)`"
                    tooltip="Income (TODO)"
                />

                <base-status
                    v-else-if="!data.active"
                    status="danger"
                    :label="`-${getCurrencySymbol(data.brokerAccountCurrency)}15 (2%)`"
                    tooltip="Loss (TODO)"
                />
              </template>
            </base-table-column>

            <base-table-column
                v-if="!storeState.actionSection.isActive && !storeState.itemSection.isActive"
                field="during"
                header="During"
            >
              <template #body="{ data }">
                @TODO
              </template>
            </base-table-column>

            <base-table-column
                v-if="!storeState.actionSection.isActive && !storeState.itemSection.isActive"
                class="bot-actions"
                field="actions"
                header="Actions"
            >
              <template #body="{ data }">
                <bot-action-buttons :bot="data" />
              </template>
            </base-table-column>
          </base-table>
        </base-scroll-panel>
      </template>

      <section-container v-else class="bots-message-section">
        <div v-if="!brokers.length">
          <div>To create a bot you need a broker.</div>

          <base-button class="flow" @click="connectBroker">
            Connect broker
          </base-button>
        </div>

        <div v-else-if="!bots.length">
          <div>You don't have bots.</div>

          <base-button class="flow" @click="createBot">
            Create bot
          </base-button>
        </div>
      </section-container>
    </div>
  </page-container>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue';

import type { BotClientInfo, LoadBotsPayload } from 'global/types';
import { BotState } from 'global/constants';

import { SectionComponent, ActionType } from 'shared/constants';
import { getCurrencySymbol } from 'shared/utils';

import { runAction } from 'services/actions';

import { useCloseItemSection, useLoadBrokers, useOpenActionSection, useOpenItemSection } from 'app/hooks';
import { Store, useStore } from 'app/store';


// Components
import PageContainer from 'components/containers/page-container.vue';
import SectionContainer from 'components/containers/section-container.vue';
import BrokerDataView from 'components/broker-data-view.vue';
import BotActionButtons from 'components/bot-action-buttons.vue';
import BotStatus from 'components/bot-status.vue';


// Types
type ComponentState = {
  isLoading: boolean;
  isActionProcessing: boolean;
  selectedBot: BotClientInfo | null;
}


// Data
const { state: storeState }: Store = useStore();

const loadBrokers = useLoadBrokers(false);

const openBrokerActionSection = useOpenActionSection(SectionComponent.BROKER);
const openBotActionSection = useOpenActionSection(SectionComponent.BOT);

const openItemSection = useOpenItemSection(SectionComponent.BOT);
const closeItemSection = useCloseItemSection();

const state = reactive<ComponentState>({
  isLoading: true,
  isActionProcessing: false,
  selectedBot: null,
});

const bots = computed(() => storeState.user.bots);
const brokers = computed(() => storeState.user.brokers);

watch(() => storeState.actionSection.isActive, () => {
  if (storeState.actionSection.isActive) {
    state.selectedBot = null;
  }
});

watch(() => storeState.itemSection.isActive, () => {
  if (!storeState.itemSection.isActive) {
    state.selectedBot = null;
  }
});


// Hooks
onMounted(() => loadBotsAndBrokers());


// Fetch
async function loadBotsAndBrokers(): Promise<void> {
  await runAction<LoadBotsPayload>({
    type: ActionType.BOTS_LOAD,
    payload: {},
  });

  await loadBrokers();

  state.isLoading = false;
}


// Methods
function createBot(): void {
  if (state.isActionProcessing) return;

  openBotActionSection({});
}

function connectBroker(): void {
  openBrokerActionSection({});
}

function selectBot({ data, originalEvent }: { data: BotClientInfo, originalEvent: Event }): void {
  // @ts-ignore
  if (originalEvent.target.classList.contains('button-action')) {
    return;
  }

  state.selectedBot = data;
  openItemSection({ bot: data });
}

function unselectBot(): void {
  state.selectedBot = null;
  closeItemSection();
}
</script>

<style lang="scss" scoped>
.bots-container {
  transition: .2s;
}

.bots-item-skeleton {
  height: 70px !important;
  margin-bottom: 10px !important;
}

.bots-table-header-skeleton {
  gap: 15%;
  margin-bottom: 20px;
}

.bot-name {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 120px;
  white-space: nowrap;
}

.bots-message-section {
  text-align: center;
  margin: 0 auto;
  width: 50%;

  .p-button {
    margin: 20px auto 0;
  }
}
</style>
