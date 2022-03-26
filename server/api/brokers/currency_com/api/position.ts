import { ProcessError } from 'shared/exceptions';

import type { ClosePositionRequest, CreateOrderRequest, CreateOrderResponse } from '../types';
import type { ClosedPositionsResponse, ClosePositionResponse } from '../types';
import type { Position, PositionListRequest, ActivePositionsResponse } from '../types';
import type { ActivePosition, ClosedPosition, ActiveParsedPosition, ClosedParsedPosition } from '../types';

import { Endpoint, OrderType } from '../constants';
import type { RestApi } from '../rest-api';


export class PositionApi {
  constructor(
    private restApi: RestApi,
  ) {}


  async openPosition(position: Position): Promise<ActiveParsedPosition> {
    const createdOrder = await this.restApi.post<CreateOrderRequest, CreateOrderResponse>(Endpoint.ORDER, {
      ...position,
      type: OrderType.MARKET,
      timestamp: Date.now(),
    });

    const { positions } = await this.restApi.get<PositionListRequest, ActivePositionsResponse>(Endpoint.POSITIONS, {
      timestamp: Date.now(),
    });

    const createdPosition: ActivePosition | undefined
      = positions.find(({ orderId }) => orderId === createdOrder.orderId);

    if (createdPosition) {
      return {
        id: createdPosition.id,
        fee: createdPosition.fee,
      };
    }

    throw new ProcessError(`Something went wrong with open position. Please, check position in broker system.`);
  }

  async closePosition(positionId: string, marketSymbol: string): Promise<ClosedParsedPosition> {
    await this.restApi.post<ClosePositionRequest, ClosePositionResponse>(Endpoint.CLOSE_POSITION, {
      positionId,
      timestamp: Date.now(),
    });

    const { history } = await this.restApi.get<PositionListRequest, ClosedPositionsResponse>(Endpoint.POSITIONS_HISTORY, {
      symbol: marketSymbol,
      timestamp: Date.now(),
    });

    const closedPosition: ClosedPosition | undefined = history.find(({ positionId: id }) => id === positionId);

    if (closedPosition) {
      return {
        fee: closedPosition.fee,
        result: closedPosition.rpl,
      };
    }

    throw new ProcessError(`Something went wrong with position closing. Please, check position in broker system.`);
  }
}
