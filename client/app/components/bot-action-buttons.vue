<template>
  <div class="actions-group">
    <template v-if="props.bot.state === BotState.ALIVE">
      <button-action
          v-if="props.bot.active"
          type="confirm"
          icon="stop-circle"
          actionClass="danger"
          tooltip="Deactivate"
          popupType="danger"
          popupMessage="This action will close all open positions of this bot.<br><br>Are you sure you want to <strong>deactivate</strong> this bot?"
          :blocked="state.isActionProcessing"
          :popupCommand="deactivateBot"
      />

      <button-action
          v-if="!props.bot.active"
          type="confirm"
          icon="play"
          actionClass="accent"
          tooltip="Activate"
          popupType="confirm"
          popupMessage="Are you sure you want to <strong>activate</strong> this bot?"
          :blocked="state.isActionProcessing"
          :popupCommand="activateBot"
      />

      <button-action-edit
          :blocked="state.isActionProcessing"
          @click="editBot"
      />

      <button-action
          type="confirm"
          icon="inbox"
          actionClass="danger"
          tooltip="Archive"
          popupType="danger"
          :blocked="state.isActionProcessing"
          :popupMessage="getDangerActionMessage('archive')"
          :popupCommand="archiveBot"
      />
    </template>

    <button-action-delete
        v-else-if="props.bot.state === BotState.ARCHIVE"
        :message="getDangerActionMessage('delete')"
        :blocked="state.isActionProcessing"
        :deleteFunction="deleteBot"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

import type { BotClientInfo } from 'global/types';
import { BotState, BotUpdateType } from 'global/constants';

import type { BotDeletePayload, BotUpdatePayload } from 'shared/types';
import { ActionType, SectionComponent } from 'shared/constants';
import { runAction } from 'shared/actions';

import { Notifications } from 'services/notifications';

import { useCloseItemSection, useOpenActionSection } from 'app/hooks';
import { Store, useStore } from 'app/store';


// Components
import ButtonAction from 'components/button-action.vue';
import ButtonActionEdit from 'components/button-action-edit.vue';
import ButtonActionDelete from 'components/button-action-delete.vue';


// Types
type ComponentState = {
  isActionProcessing: boolean;
}

type ComponentProps = {
  bot: BotClientInfo;
}


// Data
const { state: storeState }: Store = useStore();

const openBotActionSection = useOpenActionSection(SectionComponent.BOT);
const closeItemSection = useCloseItemSection();

const props = defineProps<ComponentProps>();

const state = reactive<ComponentState>({
  isActionProcessing: false,
});

// Methods
function editBot(): void {
  openBotActionSection({ bot: props.bot });
}

async function activateBot(): Promise<void> {
  await updateBot(BotUpdateType.ACTIVATE);
}

async function deactivateBot(): Promise<void> {
  await updateBot(BotUpdateType.DEACTIVATE);
}

async function archiveBot(): Promise<void> {
  await updateBot(BotUpdateType.ARCHIVE);
}

async function updateBot(type: BotUpdateType): Promise<void> {
  state.isActionProcessing = true;

  const { id } = props.bot;
  const { name: botName } = findBot(id);

  await runAction<BotUpdatePayload>({
    type: ActionType.BOTS_UPDATE,
    payload: { id, type, botName, updates: {} },
  });

  state.isActionProcessing = false;
}

async function deleteBot(): Promise<void> {
  state.isActionProcessing = true;

  const { id } = props.bot;
  const { name: botName }: BotClientInfo = findBot(id);

  await runAction<BotDeletePayload>({
    type: ActionType.BOTS_DELETE,
    payload: { id, botName },
    callback: () => {
      closeItemSection();
    },
  });

  state.isActionProcessing = false;
}


// Helpers
function getDangerActionMessage(action: 'delete' | 'archive'): string {
  const message: string = `The action cannot be undone. Are you sure you want to <strong>${action}</strong> this bot?`;

  return props.bot.active
    ? 'This action will close all open positions of this bot.<br><br>' + message
    : message;
}

function findBot(botId: string): BotClientInfo {
  const foundBot: BotClientInfo | undefined = storeState.user.bots.find(({ id }) => id === botId);

  if (!foundBot) {
    Notifications.showErrorNotification(
        `Application Error`,
        `Cannot find bot with id '${botId}' in store`
    );

    // @TODO: error processing
    throw new Error(`[app] - Cannot find bot with id '${botId}'`);
  }

  return foundBot;
}
</script>

<style lang="scss" scoped>

</style>
