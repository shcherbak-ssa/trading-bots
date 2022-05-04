import type {
  BrokersPositionsApi,
  CheckMaxLossBotPayload,
  NewOpenPosition,
  PositionsCreatePayload,
  OpenPosition,
  OpenPositionDeletePayload,
  OpenPositionGetPayload,
  OpenPositionsDatabaseCollection,
  OpenPositionUpdatePayload,
  OpenPositionCheckClosePayload
} from 'shared/types';

import { ActionType } from 'shared/constants';

import { runAction } from 'services/actions';

import { UserOpenPositions } from 'api/database/user-open-positions';
import { BrokersPositions } from 'api/brokers/brokers-positions';


const brokersPositionsApi: BrokersPositionsApi = new BrokersPositions();


export const openPositionsActions = {
  async [ActionType.OPEN_POSITIONS_GET](userId: string, { botId }: OpenPositionGetPayload): Promise<OpenPosition | null> {
    const openPositionsCollection: OpenPositionsDatabaseCollection = await UserOpenPositions.connect(userId);

    return await openPositionsCollection.getOpenPosition(botId);
  },

  async [ActionType.OPEN_POSITIONS_CREATE](userId: string, newOpenPosition: NewOpenPosition): Promise<OpenPosition> {
    const openPositionsCollection: OpenPositionsDatabaseCollection = await UserOpenPositions.connect(userId);

    return await openPositionsCollection.createOpenPosition(newOpenPosition);
  },

  async [ActionType.OPEN_POSITIONS_UPDATE](userId: string, { id, updates }: OpenPositionUpdatePayload): Promise<void> {
    const openPositionsCollection: OpenPositionsDatabaseCollection = await UserOpenPositions.connect(userId);

    await openPositionsCollection.updateOpenPosition(id, updates);
  },

  async [ActionType.OPEN_POSITIONS_DELETE](
    userId: string,
    { position, bot }: OpenPositionDeletePayload
  ): Promise<void> {
    const openPositionsCollection: OpenPositionsDatabaseCollection = await UserOpenPositions.connect(userId);

    await openPositionsCollection.deleteOpenPosition(position.id);

    await runAction<PositionsCreatePayload, void>({
      type: ActionType.POSITIONS_CREATE,
      userId,
      payload: { bot, openPosition: position },
    });

    await runAction<CheckMaxLossBotPayload, void>({
      type: ActionType.BOT_MANAGER_CHECK_MAX_LOSS,
      userId,
      payload: { bot },
    });
  },

  async [ActionType.OPEN_POSITIONS_CHECK_CLOSE](
    userId: string,
    { position, bot, brokerApiKeys }: OpenPositionCheckClosePayload
  ): Promise<number | null> {
    const closedPositionsCount: number | null = await brokersPositionsApi.checkPositionClose({
      accountType: bot.brokerAccountType,
      apiKeys: brokerApiKeys,
      brokerName: bot.brokerName,
      position,
    });

    if (typeof closedPositionsCount === 'number') {
      await runAction<OpenPositionDeletePayload, void>({
        type: ActionType.OPEN_POSITIONS_DELETE,
        userId,
        payload: { bot, position },
      });
    }

    return closedPositionsCount;
  },
}
