import fetch from 'node-fetch';

import { QUERY_URL_SEPARATOR, RequestMethod, StatusCode } from 'global/constants';
import { ProcessError } from 'shared/exceptions';
import { generateHmacSignature, stringifyPayload } from 'shared/utils';
import { BrokerRestApi } from 'api/brokers/lib/broker-rest-api';

import type { Endpoint } from '../constants';

import type { ResponseError } from './types';
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

    const { msg, code } = await response.json() as ResponseError;
    const errorMessage: string = `Error: Currency.com API - ${code} ${msg}`;

    console.error(errorMessage);

    throw new ProcessError(errorMessage);
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
