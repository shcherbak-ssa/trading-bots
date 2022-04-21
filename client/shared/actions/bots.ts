import type { BotClientInfo, LoadBotsPayload, NewBot } from 'global/types';
import { BotState, BotUpdateType } from 'global/constants';

import type { BotDeletePayload, BotsApi, BotsStore, BotUpdatePayload } from 'shared/types';
import { ActionType } from 'shared/constants';

import { Notifications } from 'services/notifications';
import { Store } from 'services/store';

import { Bots } from 'api/server/bots';


export const botsActions = {
  async [ActionType.BOTS_LOAD](payload: LoadBotsPayload): Promise<void> {
    const api: BotsApi = new Bots();
    const bots: BotClientInfo[] = await api.loadBots(payload);

    const botsStore: BotsStore = new Store();
    botsStore.setBots(bots);
  },

  async [ActionType.BOTS_CREATE](newBot: NewBot): Promise<void> {
    const api: BotsApi = new Bots();
    const createdBot: BotClientInfo = await api.createBot(newBot);

    const botsStore: BotsStore = new Store();
    botsStore.addBot(createdBot);

    Notifications.showSuccessNotification(
      'Bot created',
      `Bot "${createdBot.name}" created successfully`,
    );
  },

  async [ActionType.BOTS_UPDATE]({ id, type, botName, updates }: BotUpdatePayload): Promise<void> {
    const api: BotsApi = new Bots();
    await api.updateBot(id, type, updates);

    let notificationTitle: string = '';
    let notificationMessage: string = '';

    switch (type) {
      case BotUpdateType.ACTIVATE:
        notificationTitle = 'Bot is active';
        notificationMessage = `Bot "${botName}" activated successfully`;

        updates.active = true;
        break;
      case BotUpdateType.DEACTIVATE:
        notificationTitle = 'Bot is inactive';
        notificationMessage = `Bot "${botName}" deactivated successfully`;

        updates.active = false;
        break;
      case BotUpdateType.ARCHIVE:
        notificationTitle = 'Bot archived';
        notificationMessage = `Bot "${botName}" archived successfully`;

        updates.active = false;
        updates.state = BotState.ARCHIVE;
        break;
      case BotUpdateType.UPDATE:
        notificationTitle = 'Bot updated';
        notificationMessage = `Bot "${botName}" updated successfully`;
        break;
    }

    const botsStore: BotsStore = new Store();
    botsStore.updateBot(id, updates);

    Notifications.showSuccessNotification(notificationTitle, notificationMessage);
  },

  async [ActionType.BOTS_DELETE]({ id, botName }: BotDeletePayload): Promise<void> {
    const api: BotsApi = new Bots();
    await api.deleteBot(id);

    const botsStore: BotsStore = new Store();
    botsStore.deleteBot(id);

    Notifications.showSuccessNotification(
      'Bot deleted',
      `Bot "${botName}" deleted successfully`,
    );
  },
};
