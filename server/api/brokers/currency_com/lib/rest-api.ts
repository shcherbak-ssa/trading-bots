import fetch from 'node-fetch';

import { QUERY_URL_SEPARATOR, RequestMethod } from 'global/constants';

import { ApiError } from 'shared/exceptions';
import { generateHmacSignature, stringifyPayload } from 'shared/utils';

import { BrokerRestApi } from 'api/brokers/lib/broker-rest-api';

import type { ResponseError } from '../types';
import type { Endpoint } from '../constants';

import { getApiUrl } from './utils';


export class RestApi extends BrokerRestApi {
  private readonly apiKey: string;
  private readonly secretKey: string;

  constructor(apiKey: string, secretKey: string) {
    super();

    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }


  async get<RequestPayload, ResponsePayload>(endpoint: Endpoint, payload: RequestPayload): Promise<ResponsePayload> {
    return await this.send(RequestMethod.GET, endpoint, payload);
  }

  async post<RequestPayload, ResponsePayload>(endpoint: Endpoint, payload: RequestPayload): Promise<ResponsePayload> {
    return await this.send(RequestMethod.POST, endpoint, payload);
  }


  private async send<RequestPayload, ResponsePayload>(
    method: RequestMethod,
    endpoint: Endpoint,
    payload: RequestPayload,
  ): Promise<ResponsePayload> {
    const url: string = this.preparingUrl(endpoint, payload);

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': this.apiKey,
      },
    });

    if (response.ok) {
      return await response.json() as ResponsePayload;
    }

    const { msg, code } = await response.json() as ResponseError;

    throw new ApiError({
      message: `${endpoint} ${response.status} ${msg} [${code}]`,
      messageHeading: `Broker Currency.com`,
      payload,
    });
  }

  private preparingUrl<Payload>(endpoint: Endpoint, payload: Payload): string {
    const apiUrl: string = getApiUrl(this.accountType);
    const queryPayload: string = this.preparingPayload(payload);

    return apiUrl + endpoint + QUERY_URL_SEPARATOR + queryPayload;
  }

  private preparingPayload<Payload>(payload: Payload): string {
    const timestamp: number = Date.now() - 500; // @TODO: fix timestamp

    const signature: string = generateHmacSignature(
      this.secretKey,
      stringifyPayload({ ...payload, timestamp }),
    );

    return stringifyPayload({ ...payload, timestamp, signature });
  }
}
