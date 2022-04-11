import { QUERY_URL_SEPARATOR, RequestMethod, ServerEndpoint } from 'global/constants';
import type { ServerApiRequest } from 'shared/types';


export class Api {
  static async get<Params, Body, Response>(request: ServerApiRequest<Params, Body>): Promise<Response> {
    return await Api.sendRequest(RequestMethod.GET, request);
  }

  static async post<Params, Body, Response>(request: ServerApiRequest<Params, Body>): Promise<Response> {
    return await Api.sendRequest(RequestMethod.POST, request);
  }

  static async put<Params, Body>(request: ServerApiRequest<Params, Body>): Promise<void> {
    return await Api.sendRequest(RequestMethod.PUT, request);
  }

  static async delete<Params, Body>(request: ServerApiRequest<Params, Body>): Promise<void> {
    return await Api.sendRequest(RequestMethod.DELETE, request);
  }


  private static async sendRequest<Params, Body, Response>(
    method: RequestMethod,
    { endpoint, params, body }: ServerApiRequest<Params, Body>,
  ): Promise<Response> {
    let apiEndpoint: string = location.origin + Api.replaceParams(endpoint, params);

    if (method === RequestMethod.GET && Object.keys(body).length) {
      // @ts-ignore
      const query: string = new URLSearchParams(body).toString();
      apiEndpoint += QUERY_URL_SEPARATOR + query;
    }

    const response = await fetch(apiEndpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: method === RequestMethod.GET ? undefined : JSON.stringify(body),
    });

    if (response.ok) {
      return await response.json() as Response;
    }

    // @TODO: implement
    console.log(response.status, await response.json());
    throw new Error('@TODO: implement');
  }

  private static replaceParams<Params>(endpoint: ServerEndpoint, params: Params): string {
    let apiEndpoint: string = endpoint;

    for (const [key, value] of Object.entries(params)) {
      apiEndpoint = apiEndpoint.replace(new RegExp(`\\(:${key}\\)\\?`, 'g'), value);
      apiEndpoint = apiEndpoint.replace(new RegExp(`:${key}`, 'g'), value);
    }

    return apiEndpoint;
  }
}
