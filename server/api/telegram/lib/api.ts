import fetch from 'node-fetch';

import { RequestMethod } from 'global/constants';

import { ApiError } from 'shared/exceptions';

import type { ResponseResult } from '../types';
import { Endpoint, API_URL } from '../constants';


export class Api {
  static async sendRequest<Payload, Result>(endpoint: Endpoint, payload: Payload): Promise<Result> {
    const response = await fetch(API_URL + endpoint, {
      method: RequestMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result: ResponseResult<Result> = await response.json();

    if (result.ok) {
      return result.result;
    }

    throw new ApiError({
      message: `${endpoint} ${result.description} [${result.error_code}]`,
      messageLabel: `Telegram`,
      payload,
    });
  }
}
