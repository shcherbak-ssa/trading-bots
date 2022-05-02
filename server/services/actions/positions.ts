import type { NewPosition, PositionsDatabaseCollection, PositionDeleteFilters } from 'shared/types';
import { ActionType } from 'shared/constants';

import { UserPositions } from 'api/database/user-positions';


export const positionsActions = {
  async [ActionType.POSITIONS_CREATE](userId: string, newPosition: NewPosition): Promise<void> {
    const positionsCollection: PositionsDatabaseCollection = await UserPositions.connect(userId);

    await positionsCollection.createPosition(newPosition);
  },

  async [ActionType.POSITIONS_DELETE](userId: string, filters: PositionDeleteFilters): Promise<void> {
    const positionsCollection: PositionsDatabaseCollection = await UserPositions.connect(userId);

    await positionsCollection.deletePositions(filters);
  },
};
