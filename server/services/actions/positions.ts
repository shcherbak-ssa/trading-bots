import { getTodayDateString } from 'global/utils';

import type {
  Position,
  PositionsCreatePayload,
  PositionsDatabaseCollection,
  PositionsDeleteFilters,
  PositionsGetFilters,
  CreationDocument,
  PositionsDatabaseDocument,
} from 'shared/types';

import { ActionType } from 'shared/constants';

import { UserPositions } from 'api/database';


export const positionsActions = {
  async [ActionType.POSITIONS_GET](userId: string, filters: PositionsGetFilters): Promise<Position[]> {
    const positionsCollection: PositionsDatabaseCollection = await UserPositions.connect(userId);

    return await positionsCollection.getPositions(filters);
  },

  async [ActionType.POSITIONS_CREATE](userId: string, { bot, openPosition }: PositionsCreatePayload): Promise<void> {
    const { feeOpen, feeClose, result, isLong } = openPosition;

    const newPosition: CreationDocument<PositionsDatabaseDocument> = {
      result,
      isLong,
      botId: bot.id,
      botActivationIndex: bot.activations.length,
      totalFee: feeOpen + feeClose,
      closedAt: getTodayDateString(),
    };

    const positionsCollection: PositionsDatabaseCollection = await UserPositions.connect(userId);

    await positionsCollection.createPosition(newPosition);
  },

  async [ActionType.POSITIONS_DELETE](userId: string, filters: PositionsDeleteFilters): Promise<void> {
    const positionsCollection: PositionsDatabaseCollection = await UserPositions.connect(userId);

    await positionsCollection.deletePositions(filters);
  },
};
