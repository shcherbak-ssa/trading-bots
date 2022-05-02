import { BOT_TOKEN_SEPARATOR } from 'global/constants';

import type {
  NewOpenPosition,
  NewPosition,
  OpenPosition,
  OpenPositionDeletePayload,
  OpenPositionGetPayload,
  OpenPositionsDatabaseCollection,
  OpenPositionUpdatePayload,
} from 'shared/types';

import { ActionType } from 'shared/constants';
import { getTodayDateString } from 'shared/utils';

import { runAction } from 'services/actions';

import { UserOpenPositions } from 'api/database/user-open-positions';


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
    { success, position, bot }: OpenPositionDeletePayload
  ): Promise<void> {
    const openPositionsCollection: OpenPositionsDatabaseCollection = await UserOpenPositions.connect(userId);

    await openPositionsCollection.deleteOpenPosition(position.id);

    if (success) {
      const [ userId, botId ] = bot.token.split(BOT_TOKEN_SEPARATOR);
      const { feeOpen, feeClose, result, isLong } = position;

      const newPosition: NewPosition = {
        botId,
        result,
        isLong,
        botActivationIndex: bot.activations.length,
        totalFee: feeOpen + feeClose,
        closedAt: getTodayDateString(),
      };

      await runAction<NewPosition, void>({
        type: ActionType.POSITIONS_CREATE,
        userId,
        payload: newPosition,
      });
    }
  },
}
