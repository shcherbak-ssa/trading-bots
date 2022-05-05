import { PositionError } from 'shared/exceptions';
import { sleep } from 'shared/utils';

import type {
  ClosedParsedPositions,
  ClosePositionRequest,
  CreateOrderRequest,
  CreateOrderResponse,
  ClosedPositionsResponse,
  ClosePositionResponse,
  ClosedPosition,
  Position,
  PositionListRequest,
  ActivePositionsResponse,
  ActivePosition,
  ActiveParsedPositions,
} from '../types';

import {
  Endpoint,
  OrderType,
  POSITION_ACTION_SLEEP_TIME,
  POSITION_CHECK_LIMIT,
  POSITION_HISTORY_LIMIT
} from '../constants';

import type { RestApi } from './rest-api';


export class PositionApi {
  constructor(
    private restApi: RestApi,
  ) {}


  async openPosition(position: Position): Promise<ActiveParsedPositions> {
    const { orderId: createdOrderId, rejectMessage }
      = await this.restApi.post<CreateOrderRequest, CreateOrderResponse>(
        Endpoint.ORDER,
        { ...position, type: OrderType.MARKET },
      );

    if (rejectMessage !== undefined) {
      console.error(` - error: [position] open positions - ${rejectMessage}`);

      throw new PositionError(
        {
          message: `Something went wrong with open position. Reason: ${rejectMessage}.`
        }, {
          message: `Please, check position in broker system.`,
        },
      );
    }

    let checkCount: number = 0;

    while (checkCount !== POSITION_CHECK_LIMIT) {
      console.info(` - info: [position] check open positions (${checkCount})`);

      const activePositions: ActivePosition[] = await this.getActivePositions(createdOrderId);

      if (activePositions.length) {
        const openQuantity: number = activePositions.reduce((total, position) => {
          return total + position.openQuantity;
        }, 0);

        if (Math.abs(openQuantity) === position.quantity) {
          return this.parseActivePositions(activePositions);
        }
      }

      await sleep(POSITION_ACTION_SLEEP_TIME);

      checkCount += 1;
    }

    console.error(` - error: [position] open positions - no open positions found`);

    throw new PositionError(
      {
        message: `Something went wrong with open position. Reason: no open positions found.`
      }, {
        message: `Please, check position in broker system.`,
      },
    );
  }

  async closePosition(positionIds: string[], marketSymbol: string): Promise<ClosedParsedPositions> {
    for (const id of positionIds) {
      const { request: [{ rejectReason }] }
        = await this.restApi.post<ClosePositionRequest, ClosePositionResponse>(
          Endpoint.CLOSE_POSITION,
          { positionId: id }
        );

      if (rejectReason !== undefined) {
        console.error(` - error: [position] close positions (${positionIds.length}) - ${rejectReason}`);

        throw new PositionError(
          {
            message: `Something went wrong with position closing. Reason: ${rejectReason}.`
          }, {
            message: `Please, check position in broker system.`,
          },
        );
      }
    }

    let checkCount: number = 0;

    while (checkCount !== POSITION_CHECK_LIMIT) {
      console.info(` - info: [position] check close positions (${checkCount})`);

      const closedPositions: ClosedPosition[] = await this.getClosedPositions(positionIds, marketSymbol);

      if (closedPositions.length === positionIds.length) {
        return this.parseClosedPositions(closedPositions);
      }

      await sleep(POSITION_ACTION_SLEEP_TIME);

      checkCount += 1;
    }

    console.error(` - error: [position] close positions (${positionIds.length}) - invalid history positions length`);

    throw new PositionError(
      {
        message: `Something went wrong with position closing.`
      }, {
        message: `Please, check position in broker system.`,
      },
    );
  }


  // Helpers
  async getActivePositions(createdOrderId: string): Promise<ActivePosition[]> {
    const { positions }
      = await this.restApi.get<PositionListRequest, ActivePositionsResponse>(Endpoint.POSITIONS, {});

    return positions.filter(({ orderId }) => orderId === createdOrderId);
  }

  async getClosedPositions(positionIds: string[], marketSymbol: string): Promise<ClosedPosition[]> {
    const { history } = await this.restApi.get<PositionListRequest, ClosedPositionsResponse>(
      Endpoint.POSITIONS_HISTORY,
      {
        symbol: marketSymbol,
        limit: POSITION_HISTORY_LIMIT + positionIds.length,
      },
    );

    return history.filter(({ positionId: id }) => {
      return positionIds.includes(id);
    });
  }

  parseClosedPositions(closedPositions: ClosedPosition[]): ClosedParsedPositions {
    return closedPositions
      .reduce((result, position) => {
        result.totalFee += position.fee;
        result.result += position.rpl;

        return result;
      }, { totalFee: 0, result: 0 } as ClosedParsedPositions);
  }

  parseActivePositions(activePositions: ActivePosition[]): ActiveParsedPositions {
    return activePositions
      .reduce((result, position) => {
        result.ids.push(position.id);
        result.totalFee += position.fee;

        return result;
      }, { totalFee: 0, ids: [] } as ActiveParsedPositions);
  }
}
