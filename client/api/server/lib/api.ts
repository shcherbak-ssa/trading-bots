import type { ErrorPayload } from 'global/types';
import { QUERY_URL_SEPARATOR, RequestMethod, ServerEndpoint, StatusCode } from 'global/constants';

import type { ServerApiRequest } from 'shared/types';
import { Notifications } from 'services/notifications';


export class Api {
  static async get<Params, Body, Response>(request: ServerApiRequest<Params, Body>): Promise<Response | ErrorPayload> {
    return await Api.send(RequestMethod.GET, request);
  }

  static async post<Params, Body, Response>(request: ServerApiRequest<Params, Body>): Promise<Response | ErrorPayload> {
    return await Api.send(RequestMethod.POST, request);
  }

  static async put<Params, Body>(request: ServerApiRequest<Params, Body>): Promise<ErrorPayload | {}> {
    return await Api.send(RequestMethod.PUT, request);
  }

  static async delete<Params, Body>(request: ServerApiRequest<Params, Body>): Promise<ErrorPayload | {}> {
    return await Api.send(RequestMethod.DELETE, request);
  }


  private static async send<Params, Body, Response>(
    method: RequestMethod,
    { endpoint, params, body }: ServerApiRequest<Params, Body>,
  ): Promise<Response | ErrorPayload> {
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
      },
      body: isGetRequest ? undefined : JSON.stringify(body),
    });

    if (response.ok) {
      const { status } = response;

      if (status === StatusCode.DELETED || status === StatusCode.UPDATED) {
        return {} as Response;
      }

      return await response.json() as Response;
    }

    if (response.status >= StatusCode.INTERNAL_SERVER_ERROR) {
      const { errors } = await response.json() as ErrorPayload;
      const { status, statusText } = response;

      const message: string = errors.map(({ message }) => message).join('');

      Notifications.showErrorNotification(`${status} ${statusText}`, message);

      return { errors: [] };
    }

    return await response.json() as ErrorPayload;
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
