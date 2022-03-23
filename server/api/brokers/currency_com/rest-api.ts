import fetch from 'node-fetch';

import { BrokerAccountType, QUERY_URL_SEPARATOR, RequestMethod } from 'global/constants';
import { BrokerApiError } from 'shared/exceptions';
import { generateHmacSignature, stringifyPayload } from 'shared/utils';

import type { ResponseError } from './types';
import type { Endpoint } from './constants';
import { getApiUrl } from './utils';


export class RestApi {
  private accountType: BrokerAccountType = BrokerAccountType.DEMO;

  constructor(
    private apiKey: string,
    private secretKey: string,
  ) {}


  setAccountType(accountType: BrokerAccountType): RestApi {
    this.accountType = accountType;

    return this;
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
    const requestUrl: string = this.preparingUrl(endpoint, payload);

    const response = await fetch(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-MBX-APIKEY': this.apiKey,
      },
    });

    if (response.ok) {
      return await response.json() as ResponsePayload;
    }

    const { msg } = await response.json() as ResponseError;

    throw new BrokerApiError(msg, response.status);
  }

  private preparingUrl<Payload>(endpoint: Endpoint, payload: Payload): string {
    const apiUrl: string = getApiUrl(this.accountType);
    const queryPayload: string = this.preparingPayload(payload);

    return apiUrl + endpoint + QUERY_URL_SEPARATOR + queryPayload;
  }

  private preparingPayload<Payload>(payload: Payload): string {
    const signature: string = generateHmacSignature(
      this.secretKey,
      stringifyPayload(payload),
    );

    return stringifyPayload({ ...payload, signature });
  }
}
