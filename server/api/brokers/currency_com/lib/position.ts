import { logger } from 'shared/logger';
import { ApiError } from 'shared/exceptions';
import { sleep } from 'shared/utils';

import type {
  ActiveParsedPositions,
  ActivePosition,
  ActivePositionsResponse,
  ClosedParsedPositions,
  ClosedPosition,
  ClosedPositionsResponse,
  ClosePositionRequest,
  ClosePositionResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  Position,
  PositionListRequest,
} from '../types';

import {
  Endpoint,
  OrderType,
  POSITION_ACTION_SLEEP_TIME,
  POSITION_CHECK_LIMIT,
  POSITION_HISTORY_LIMIT
} from '../constants';

import type { RestApi } from './rest-api';
import { LogScope } from 'shared/constants';


export class PositionApi {
  constructor(
    private restApi: RestApi,
  ) {}


  async openPosition(position: Position): Promise<ActiveParsedPositions> {
    const createdOrder
      = await this.restApi.post<CreateOrderRequest, CreateOrderResponse>(
        Endpoint.ORDER,
        { ...position, type: OrderType.MARKET },
      );

    if (createdOrder.rejectMessage !== undefined) {
      const { rejectMessage } = createdOrder;

      throw new ApiError({
        message: `Something went wrong with open position.\nReason: ${rejectMessage}.\n\nPlease, check position in broker system.`,
        messageLabel: 'Broker Currency.com',
        payload: createdOrder,
      });
    }

    let checkCount: number = 0;

    while (checkCount !== POSITION_CHECK_LIMIT) {
      logger.logInfo(LogScope.API, `Broker Currency.com - check open positions (${checkCount})`);

      const activePositions: ActivePosition[] = await this.getActivePositions(createdOrder.orderId);

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

    throw new ApiError({
      message: `Something went wrong with open position.\nReason: no open positions found.\n\nPlease, check position in broker system.`,
      messageLabel: 'Broker Currency.com',
      payload: createdOrder,
    });
  }

  async closePosition(positionIds: string[], marketSymbol: string): Promise<ClosedParsedPositions> {
    for (const id of positionIds) {
      const { request: [ closePositionResult ] }
        = await this.restApi.post<ClosePositionRequest, ClosePositionResponse>(
          Endpoint.CLOSE_POSITION,
          { positionId: id }
        );

      if (closePositionResult.rejectReason !== undefined) {
        const { rejectReason } = closePositionResult;

        throw new ApiError({
          message: `Something went wrong with open position.\nReason: ${rejectReason}.\n\nPlease, check position in broker system.`,
          messageLabel: 'Broker Currency.com',
          payload: closePositionResult,
        });
      }
    }

    let checkCount: number = 0;

    while (checkCount !== POSITION_CHECK_LIMIT) {
      logger.logInfo(LogScope.API, `Broker Currency.com - check close positions (${checkCount})`);

      const closedPositions: ClosedPosition[] = await this.getClosedPositions(positionIds, marketSymbol);

      if (closedPositions.length === positionIds.length) {
        return this.parseClosedPositions(closedPositions);
      }

      await sleep(POSITION_ACTION_SLEEP_TIME);

      checkCount += 1;
    }

    throw new ApiError({
      message: `Something went wrong with open position.\n\nPlease, check position in broker system.`,
      messageLabel: 'Broker Currency.com',
    });
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
