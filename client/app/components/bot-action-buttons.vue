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
          popupMessage="This action will close open position of this bot.<br><br>Are you sure you want to <strong>deactivate</strong> this bot?"
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

      <button-action
          v-if="props.bot.active"
          type="confirm"
          icon="refresh"
          actionClass="danger"
          tooltip="Restart"
          popupType="danger"
          :blocked="state.isActionProcessing"
          :popupMessage="getDangerActionMessage('restart')"
          :popupCommand="restartBot"
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

import { runAction } from 'services/actions';

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
const { state: storeState, getters: storeGetters }: Store = useStore();

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

async function restartBot(): Promise<void> {
  await updateBot(BotUpdateType.RESTART);
}

async function archiveBot(): Promise<void> {
  await updateBot(BotUpdateType.ARCHIVE);
}

async function updateBot(type: BotUpdateType): Promise<void> {
  state.isActionProcessing = true;

  const { id } = props.bot;
  const { name: botName } = storeGetters.getUserBot(id);

  await runAction<BotUpdatePayload>({
    type: ActionType.BOTS_UPDATE,
    payload: { id, type, botName, updates: {} },
  });

  state.isActionProcessing = false;
}

async function deleteBot(): Promise<void> {
  state.isActionProcessing = true;

  const { id } = props.bot;
  const { name: botName }: BotClientInfo = storeGetters.getUserBot(id);

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
function getDangerActionMessage(action: 'delete' | 'archive' | 'restart'): string {
  const closePositionMessage: string = props.bot.active
    ? 'This action will close open position of this bot.<br><br>'
    : '';

  const undoneMessage: string = action === 'restart' ? '' : 'The action cannot be undone. ';
  const question: string = `Are you sure you want to <strong>${action}</strong> this bot?`;

  return closePositionMessage + undoneMessage + question;
}
</script>

<style lang="scss" scoped></style>
