import type { App, Bots } from 'shared/types';
import { RequestMethod, RoutePathname, StatusCode } from 'global/constants';

import { botsController } from '../controllers/bots';


export const apiBotsRoutes = {
  pathname: RoutePathname.API_BOTS,
  routes: [
    {
      method: RequestMethod.GET,
      handler: async ({ params }: App.Request): Promise<App.Response> => {
        const payload = { ...params } as Bots.ReadPayload;
        const result: Bots.ReadResult = await botsController.read(payload);

        return {
          status: StatusCode.SUCCESS,
          json: result,
        };
      },
    },
    {
      method: RequestMethod.POST,
      handler: async (request: App.Request): Promise<App.Response> => {
        const payload = {} as Bots.ReadPayload;
        const result: Bots.CreateResult = await botsController.create(payload);

        return {
          status: StatusCode.CREATED,
          json: result,
        };
      },
    },
    {
      method: RequestMethod.PUT,
      handler: async ({ params }: App.Request): Promise<App.Response> => {
        const payload = { ...params } as Bots.UpdatePayload;
        await botsController.update(payload);

        return {
          status: StatusCode.UPDATED,
        };
      },
    },
    {
      method: RequestMethod.DELETE,
      handler: async ({ params }: App.Request): Promise<App.Response> => {
        const payload = { ...params } as Bots.DeletePayload;
        await botsController.delete(payload);

        return {
          status: StatusCode.DELETED,
        };
      },
    },
  ],
};
