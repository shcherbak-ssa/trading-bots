import fetch from 'node-fetch';

import { RequestMethod } from 'global/constants';

import { ApiError } from 'shared/exceptions';

import { BrokerRestApi } from 'api/brokers/lib/broker-rest-api';

import type { Endpoint } from '../constants';

import { getApiUrl } from './utils';


export class RestApi extends BrokerRestApi {
  private readonly apiKey: string

  constructor(apiKey: string) {
    super();

    this.apiKey = apiKey;
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
    const requestUrl: string = this.preparingUrl(endpoint);

    const response = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json() as ResponsePayload;
    }

    throw new ApiError({
      message: '@TODO',
      messageHeading: 'Broker - Capital.com',
    });
  }

  private preparingUrl(endpoint: Endpoint): string {
    const apiUrl: string = getApiUrl(this.accountType);

    return apiUrl + endpoint;
  }
}
