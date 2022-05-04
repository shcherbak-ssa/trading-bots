import type { Bot } from 'global/types';
import { AnalyticsBotProgressType } from 'global/constants';


export type AnalyticsBotProgress = {
  botActivationIndex: number;
  totalFee: number;
  totalLoss: number;
  totalProfit: number;
  totalResult: number;
  changePercent: number;
}

export type AnalyticsGetBotProgressPayload = {
  botId?: string;
  bot?: Bot;
  type: AnalyticsBotProgressType;
}
