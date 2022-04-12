<template>
  <section-container title="Brokers">
    <template v-if="state.isLoading">
      <base-table class="base-table section" :value="[{}, {}, {}]">
        <base-table-column field="name" header="Name">
          <template #body="{ data }">
            <base-skeleton class="text" />
          </template>
        </base-table-column>

        <base-table-column field="bots" header="Bots">
          <template #body="{ data }">
            <base-skeleton class="text" />
          </template>
        </base-table-column>

        <base-table-column field="expiresDate" header="Expires">
          <template #body="{ data }">
            <base-skeleton class="text" />
          </template>
        </base-table-column>

        <base-table-column field="actions" header="Actions">
          <template #body="{ data }">
            <base-skeleton class="text" />
          </template>
        </base-table-column>
      </base-table>

      <base-skeleton class="button-flow" />
    </template>

    <template v-else>
      <base-table
          v-if="storeState.user.brokers.length"
          class="base-table section"
          :value="storeState.user.brokers"
      >
        <base-table-column field="name" header="Name">
          <template #body="{ data }">
            <div class="flex-align-center">
              <img class="broker-icon" :src="getBroker(data.name).logo" />
              <span>{{ getBroker(data.name).label }}</span>
            </div>
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
                  v-if="data.bots.length - getActiveBotsCount(data.bots)"
                  status="info"
                  tooltip="Inactive"
                  :label="data.bots.length - getActiveBotsCount(data.bots)"
              />
            </div>

            <div v-else>-</div>
          </template>
        </base-table-column>

        <base-table-column field="expiresDate" header="Expires">
          <template #body="{ data }">
            <div>{{ formDate(new Date(data.expiresDate)) }}</div>
          </template>
        </base-table-column>

        <base-table-column field="actions" header="Actions">
          <template #body="{ data }">
            <div class="base-table-actions-group flex">
              <div class="base-table-action delete" @click="deleteBroker($event, data.id)">
                <i
                    v-if="state.isDeletionProcessing"
                    class="pi pi-spin pi-spinner"
                    style="font-size: 1rem"
                />

                <base-icon
                    v-else
                    class="base-icon"
                    :icon="deleteIcon"
                />
              </div>
            </div>
          </template>
        </base-table-column>
      </base-table>

      <div v-else class="empty-message">
        You have no connected brokers.
      </div>

      <base-button class="flow" @click="connectBroker">
        Connect Broker
      </base-button>
    </template>
  </section-container>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useConfirm } from 'primevue/useconfirm';

import type { BrokerClientBotsInfo } from 'global/types';
import type { BrokerName } from 'global/constants';

import type { Broker } from 'shared/types';
import { ActionSectionComponent, ActionType, IconList, StoreMutation } from 'shared/constants';
import { brokerList } from 'shared/content';
import { runAction } from 'shared/actions';
import { formDate } from 'shared/utils';

import { Notifications } from 'services/notifications';
import { Store, useStore } from 'app/store';


// Components
import SectionContainer from 'components/section-container.vue';
import BaseStatus from 'components/base/base-status.vue';


// Types
type ComponentState = {
  isLoading: boolean;
  isDeletionProcessing: boolean;
}


// Data
const { state: storeState, commit }: Store = useStore();
const confirmPopup = useConfirm();

const state = reactive<ComponentState>({
  isLoading: true,
  isDeletionProcessing: false,
});

const editIcon = IconList.EDIT;
const deleteIcon = IconList.DELETE;


// Hooks
onMounted(() => loadBrokers());


// Methods
async function loadBrokers(): Promise<void> {
  await runAction({
    type: ActionType.BROKERS_GET,
    payload: {}
  });

  state.isLoading = false;
}

function getBroker(brokerName: BrokerName): Broker {
  return brokerList.find(({ name }) => name === brokerName) || brokerList[0];
}

function getActiveBotsCount(bots: BrokerClientBotsInfo[]): number {
  return bots.reduce((count, bot) => bot.active ? count + 1 : count, 0);
}

function connectBroker() {
  commit({
    type: StoreMutation.OPEN_ACTION_SECTION,
    component: ActionSectionComponent.CONNECT_BROKER,
  });
}

function deleteBroker(e: EventTarget, id: string): void {
  confirmPopup.require({
    target: e.currentTarget,
    message: getDeleteMessage(id),
    group: 'delete',
    acceptClass: 'delete',
    accept: () => {
      state.isDeletionProcessing = true;

      runAction({
        type: ActionType.BROKERS_DELETE,
        payload: { id },
      });

      state.isDeletionProcessing = false;
    },
    reject: () => {},
  });
}

function getDeleteMessage(id: string): string {
  const deletingBroker = storeState.user.brokers.find(({ id: brokerId }) => brokerId === id);

  if (!deletingBroker) {
    Notifications.showErrorNotification(
        `Application Error`,
        `Cannot find broker with id '${id}'. Please, contact develop`
    );

    // @TODO: error processing
    throw new Error(`[app] - Cannot find broker with id '${id}'`);
  }

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

.broker-icon {
  border-radius: 100%;
  width: 24px;
  height: 24px;
  margin-right: 5px;
}

.broker-bots {
  gap: 10px;
}
</style>
