<template>
  <section-container heading="Brokers">
    <template v-if="state.isLoading">
      <base-table class="base-table section" :value="[{}, {}]">
        <base-table-column field="name" header="Name">
          <template #body="{}">
            <base-skeleton class="text" />
          </template>
        </base-table-column>

        <base-table-column field="bots" header="Bots">
          <template #body="{}">
            <base-skeleton class="text" />
          </template>
        </base-table-column>

        <base-table-column field="expiresAt" header="Expires">
          <template #body="{}">
            <base-skeleton class="text" />
          </template>
        </base-table-column>

        <base-table-column field="actions" header="Actions">
          <template #body="{}">
            <base-skeleton class="text" />
          </template>
        </base-table-column>
      </base-table>

      <base-skeleton class="button-flow" />
    </template>

    <template v-else>
      <base-table
          v-if="storeState.user.brokers.length"
          class="base-table brokers-table section"
          :value="storeState.user.brokers"
      >
        <base-table-column field="name" header="Name">
          <template #body="{ data }">
            <broker-view type="broker" :brokerName="data.name" />
          </template>
        </base-table-column>

        <base-table-column field="bots" header="Bots">
          <template #body="{ data }">
            <div v-if="data.bots.length" class="broker-bots flex-align-center">
              <base-status
                  v-if="getActiveBotsCount(data.bots)"
                  status="success"
                  tooltip="Active"
                  :label="getActiveBotsCount(data.bots)"
              />

              <base-status
                  v-if="getInactiveBotsCount(data.bots)"
                  status="danger"
                  tooltip="Inactive"
                  :label="getInactiveBotsCount(data.bots)"
              />

              <base-status
                  v-if="getArchiveBotsCount(data.bots)"
                  status="neutral"
                  tooltip="Archived"
                  :label="getArchiveBotsCount(data.bots)"
              />
            </div>

            <div v-else>-</div>
          </template>
        </base-table-column>

        <base-table-column field="expiresAt" header="Expires">
          <template #body="{ data }">
            <div>
              <span>{{ formDate(new Date(data.expiresAt)) }}</span>

              <span v-if="isExpired(data.expiresAt)" class="danger-status"> (expired)</span>

              <span v-else :class="isExpireNear(data.expiresAt) ? 'danger-status' : ''">
                 (in {{ getReadableDateString(getMillisecondsBeforeExpires(data.expiresAt)) }})
              </span>
            </div>
          </template>
        </base-table-column>

        <base-table-column
            v-if="!storeState.actionSection.isActive"
            class="broker-actions"
            field="actions"
            header="Actions"
        >
          <template #body="{ data }">
            <div class="actions-group">
              <button-action-edit @click="editBroker(data)" />

              <button-action-delete
                  :message="getDeleteMessage(data.id)"
                  :blocked="state.isActionProcessing"
                  :deleteFunction="() => deleteBroker(data.id)"
              />
            </div>
          </template>
        </base-table-column>
      </base-table>

      <div v-else class="empty-message">
        You do not have connected brokers.
      </div>

      <base-button
          class="flow"
          :disabled="storeState.actionSection.isActive"
          @click="connectBroker"
      >
        Connect broker
      </base-button>
    </template>
  </section-container>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';

import type { Broker, BrokerBot } from 'global/types';
import { BotState } from 'global/constants';
import { getReadableDateString } from 'global/utils';

import { SectionComponent, ActionType } from 'shared/constants';
import { formDate, getMillisecondsBeforeExpires, isExpired, isExpireNear } from 'shared/utils';

import { runAction } from 'services/actions';

import { useOpenActionSection, useLoadBrokers } from 'app/hooks';
import { Store, useStore } from 'app/store';


// Components
import SectionContainer from 'components/containers/section-container.vue';
import BrokerView from 'components/broker-data-view.vue';
import ButtonActionEdit from 'components/button-action-edit.vue';
import ButtonActionDelete from 'components/button-action-delete.vue';


// Types
type ComponentState = {
  isLoading: boolean;
  isActionProcessing: boolean;
}


// Data
const { state: storeState, getters: storeGetters }: Store = useStore();

const loadBrokers = useLoadBrokers(true);
const openBrokerActionSection = useOpenActionSection(SectionComponent.BROKER);

const state = reactive<ComponentState>({
  isLoading: true,
  isActionProcessing: false,
});


// Hooks
onMounted(async () => {
  await loadBrokers();

  state.isLoading = false;
});


// Methods
function connectBroker(): void {
  openBrokerActionSection({});
}

function editBroker(broker: Broker): void {
  openBrokerActionSection({ broker });
}

async function deleteBroker(brokerId: string): Promise<void> {
  state.isActionProcessing = true;

  const deletingBroker: Broker = storeGetters.getUserBroker(brokerId);

  await runAction({
    type: ActionType.BROKERS_DELETE,
    payload: { id: brokerId, name: deletingBroker.name },
  });

  state.isActionProcessing = false;
}


// Helpers
function getActiveBotsCount(bots: BrokerBot[]): number {
  return bots.reduce((count, { active, state }) => state === BotState.ALIVE && active ? count + 1 : count, 0);
}

function getInactiveBotsCount(bots: BrokerBot[]): number {
  return bots.reduce((count, { active, state }) => state === BotState.ALIVE && !active ? count + 1 : count, 0);
}

function getArchiveBotsCount(bots: BrokerBot[]) {
  return bots.reduce((count, { state }) => state === BotState.ARCHIVE ? count + 1 : count, 0);
}

function getDeleteMessage(id: string): string {
  const deletingBroker: Broker = storeGetters.getUserBroker(id);

  let message: string = 'The action cannot be undone. Are you sure you want to delete this broker?';

  if (deletingBroker.bots.length) {
    message = `This action will remove all linked bots and their open positions.<br><br>` + message;
  }

  return message;
}
</script>

<style lang="scss" scoped>
.base-table, .empty-message {
  margin-bottom: 35px;
}

.broker-bots {
  gap: 10px;
}

.danger-status {
  color: var(--colors-secondary);
}
</style>
