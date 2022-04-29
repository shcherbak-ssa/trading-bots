import { BotState, BotUpdateType, BrokerAccountType, BrokerName } from 'global/constants';


export type Bot = {
  id: string;
  token: string;
  name: string;
  state: BotState;
  initialCapital: number;
  active: boolean;
  activeTotalTime: number;
  activateAt: string;
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

export type NewBot = Omit<
  Bot,
  'id' | 'token' | 'state' | 'initialCapital' | 'activeTotalTime' | 'activateAt' | 'createdAt'
>;

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
    initialCapital?: number;
    active?: boolean;
    activeTotalTime?: number;
    activateAt?: string;
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
