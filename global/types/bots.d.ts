import { BotState, BotUpdateType, BrokerAccountType, BrokerName } from 'global/constants';


export type Bot = {
  id: string;
  name: string;
  active: boolean;
  state: BotState;
  createdAt: string;
  brokerId: string;
  brokerName: BrokerName;
  brokerAccountId: string;
  brokerAccountType: BrokerAccountType;
  brokerAccountCurrency: string;
  brokerMarketSymbol: string;
  brokerMarketName: string;
  tradeRiskPercent: number;
  tradeMaxLossPercent: number;
  tradeCapitalPercent: number;
  tradeWithTakeProfit: boolean;
  tradeTakeProfitPL: number;
  tradeWithCustomMarketLeverage: boolean;
  tradeMarketLeverage: number;
  tradeCloseAtEndDay: boolean;
  tradeCloseAtEndWeek: boolean;
}

export type NewBot = Omit<Bot, 'id' | 'createdAt' | 'state'>;

export type BotClientInfo = Bot & {
  brokerAccount?: {
    name: string;
    amount: number;
  };
};

export type LoadBotsPayload = {
  brokerId?: string;
}

export type UpdateBotPayload = {
  id: string;
  type: BotUpdateType;
  updates: {
    name?: string;
    active?: boolean;
    state?: BotState;
    tradeRiskPercent?: number;
    tradeMaxLossPercent?: number;
    tradeCapitalPercent?: number;
    tradeWithTakeProfit?: boolean;
    tradeTakeProfitPL?: number;
    tradeWithCustomMarketLeverage?: boolean;
    tradeMarketLeverage?: number;
    tradeCloseAtEndDay?: boolean;
    tradeCloseAtEndWeek?: boolean;
  };
}
