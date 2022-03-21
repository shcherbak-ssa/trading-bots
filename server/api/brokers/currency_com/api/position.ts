import type { ClosePositionRequest, CreateOrderRequest, CreateOrderResponse } from '../types';
import type { Position, PositionListRequest, PositionListResponse } from '../types';
import type { ActivePosition, OpenPosition } from '../types';

import { Endpoint, OrderType } from '../constants';
import type { RestApi } from '../rest-api';


export class PositionApi {
  constructor(
    private restApi: RestApi,
  ) {}


  async openPosition(position: Position): Promise<OpenPosition> {
    const createdOrder = await this.restApi.post<CreateOrderRequest, CreateOrderResponse>(Endpoint.ORDER, {
      ...position,
      type: OrderType.MARKET,
      timestamp: Date.now(),
    });

    const { positions } = await this.restApi.get<PositionListRequest, PositionListResponse>(Endpoint.POSITIONS, {
      timestamp: Date.now(),
    });

    const createdPosition: ActivePosition | undefined
      = positions.find(({ orderId }) => orderId === createdOrder.orderId);

    if (createdPosition) {
      return {
        id: createdPosition.id,
        feeOpen: createdPosition.fee,
      };
    }

    throw new Error(''); // @TODO: add extensions
  }

  async closePosition(positionId: string): Promise<void> {
    const closedPosition = await this.restApi.post<ClosePositionRequest, any>(Endpoint.CLOSE_POSITION, {
      positionId,
      timestamp: Date.now(),
    });

    // @TODO: implement extend position info
  }
}
