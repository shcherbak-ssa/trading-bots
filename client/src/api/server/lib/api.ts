import type { ErrorPayload, EmptyResponse } from 'global/types';
import { QUERY_URL_SEPARATOR, RequestMethod, ServerEndpoint, StatusCode } from 'global/constants';

import type { ServerApiRequest } from 'shared/types';
import { LOCAL_STORAGE_TOKEN_KEY } from 'shared/constants';
import { AppError } from 'shared/exceptions';
import { logout } from 'shared/utils';


export class Api {
  static async get<Params, Body, Response>(request: ServerApiRequest<Params, Body>): Promise<Response> {
    return await Api.send(RequestMethod.GET, request);
  }

  static async post<Params, Body, Response>(request: ServerApiRequest<Params, Body>): Promise<Response> {
    return await Api.send(RequestMethod.POST, request);
  }

  static async put<Params, Body>(request: ServerApiRequest<Params, Body>): Promise<EmptyResponse> {
    return await Api.send(RequestMethod.PUT, request);
  }

  static async delete<Params, Body>(request: ServerApiRequest<Params, Body>): Promise<EmptyResponse> {
    return await Api.send(RequestMethod.DELETE, request);
  }


  private static async send<Params, Body, Response>(
    method: RequestMethod,
    { endpoint, params, body }: ServerApiRequest<Params, Body>,
  ): Promise<Response> {
    const isGetRequest: boolean = method === RequestMethod.GET;
    let apiEndpoint: string = location.origin + Api.replaceParams(endpoint, params);

    if (isGetRequest && Object.keys(body).length) {
      // @ts-ignore
      const query: string = new URLSearchParams(body).toString();
      apiEndpoint += QUERY_URL_SEPARATOR + query;
    }

    const response = await fetch(apiEndpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)}`,
      },
      body: isGetRequest ? undefined : JSON.stringify(body),
    });

    if (response.ok) {
      const { status } = response;

      if (status === StatusCode.NO_CONTENT) {
        return {} as Response;
      }

      return await response.json() as Response;
    }

    if (response.status === StatusCode.FORBIDDEN) {
      logout();
    }

    const { heading, message } = await response.json() as ErrorPayload;
    const { status, statusText } = response;

    throw new AppError(heading || `${status} ${statusText}`, message);
  }

  private static replaceParams<Params>(endpoint: ServerEndpoint, params: Params): string {
    let apiEndpoint: string = endpoint;

    for (const [key, value] of Object.entries(params)) {
      const paramRegExp = new RegExp(`:${key}`, 'g');

      apiEndpoint = apiEndpoint.replace(paramRegExp, value);
    }

    return apiEndpoint;
  }
}
