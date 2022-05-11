import type { AnalyticsBotProgress, AnalyticsGetBotProgressPayload, Bot } from 'global/types';
import { AnalyticsBotProgressType } from 'global/constants';

import type { BotsGetFilters, Position, PositionsGetFilters } from 'shared/types';
import { ActionType } from 'shared/constants';

import { BotProgress } from 'services/analytics';
import { runAction } from 'services/actions';


export const analyticsActions = {
  async [ActionType.ANALYTICS_GET_BOT_PROGRESS](
    userId: string,
    { botId, bot, type }: AnalyticsGetBotProgressPayload
  ): Promise<AnalyticsBotProgress[]> {
    const [ currentBot ] = bot
      ? [ bot ]
      : await runAction<BotsGetFilters, Bot[]>({
        type: ActionType.BOTS_GET,
        userId,
        payload: { id: botId, withBrokerAccount: false, withAnalytics: false },
      });

    const forCurrentActivation: boolean = type === AnalyticsBotProgressType.CURRENT;
    const getPositionsFilters: PositionsGetFilters = { botId: currentBot.id };

    if (forCurrentActivation) {
      getPositionsFilters.botActivationIndex = currentBot.activations.length;
    }

    const positions = await runAction<PositionsGetFilters, Position[]>({
      type: ActionType.POSITIONS_GET,
      userId,
      payload: getPositionsFilters,
    });

    if (type === AnalyticsBotProgressType.TOTAL) {
      const progress: AnalyticsBotProgress = BotProgress.calculateTotal(positions, currentBot);

      return [ progress ];
    }

    if (forCurrentActivation) {
      const progress: AnalyticsBotProgress = BotProgress.calculateForOneActivation(positions, currentBot);

      return [ progress ];
    }

    return BotProgress.calculateForAllActivations(positions, currentBot);
  },
};
