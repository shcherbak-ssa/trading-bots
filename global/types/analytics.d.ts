import type { Bot } from 'global/types';
import { AnalyticsBotProgressType } from 'global/constants';


export type AnalyticsBotProgress = {
  botActivationIndex: number;
  changePercent: number;
  totalFee: number;
  totalLoss: number;
  totalProfit: number;
  totalResult: number;
  state: 'empty' | 'filled';
}

export type AnalyticsGetBotProgressPayload = {
  botId?: string;
  bot?: Bot;
  type: AnalyticsBotProgressType;
}
