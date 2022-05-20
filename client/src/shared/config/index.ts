import { BotPositionCloseMode, BotRestartMode, BrokerAccountType, BrokerName } from 'global/constants';
import { botDefaultSettings } from 'global/config';

import type {
  AppMenuItem,
  BotCreateConfig,
  BrokerConnectConfig,
  BotActionState,
  StoreState
} from 'shared/types';

import { IconList, Route, SectionComponent } from 'shared/constants';


export const initialBotActionState: BotActionState = {
  active: false,
  name: '',
  brokerId: '',
  brokerName: BrokerName.CURRENCY_COM,
  brokerAccountId: '',
  brokerAccountType: BrokerAccountType.REAL,
  brokerAccountCurrency: '',
  brokerMarketSymbol: '',
  brokerMarketName: '',
  tradeRiskPercent: 2,
  tradeMaxLossPercent: 25,
  tradeCapitalPercent: 100,
  tradeWithStopLoss: true,
  tradeWithTakeProfit: false,
  tradeTakeProfitPL: 2,
  tradeWithCustomMarketLeverage: false,
  tradeCustomMarketLeverage: 0,
  positionCloseEnable: false,
  positionCloseMode: BotPositionCloseMode.NONE,
  restartEnable: false,
  restartMode: BotRestartMode.NONE,
}

export const initialStoreBrokerMarketLeverageState = {
  current: 0,
  available: [],
};

export const initialStoreState: StoreState = {
  app: {
    isMenuOpen: false, // @TODO: change to 'true'
    notification: null,
    user: null,
  },
  actionSection: {
    isActive: false,
    component: SectionComponent.DEFAULT,
    selectedBot: null,
    selectedBroker: null,
  },
  itemSection: {
    isActive: false,
    component: SectionComponent.DEFAULT,
    selectedBotId: null,
  },
  user: {
    brokers: [],
    bots: [],
  },
  broker: {
    accounts: [],
    markets: [],
    marketLeverage: { ...initialStoreBrokerMarketLeverageState },
  },
};

export const appMenuItems: AppMenuItem[] = [
  {
    label: 'Dashboard',
    icon: 'th-large',
    isMiIcon: false,
    to: Route.DASHBOARD,
  },
  {
    label: 'Bots',
    icon: IconList.BOTS,
    isMiIcon: true,
    to: Route.BOTS,
  },
  {
    label: 'Settings',
    icon: 'cog',
    isMiIcon: false,
    to: Route.SETTINGS,
  },
];

export const brokerConnectConfigs: { [p in BrokerName]: BrokerConnectConfig } = {
  [BrokerName.CURRENCY_COM]: {
    id: BrokerName.CURRENCY_COM,
    name: BrokerName.CURRENCY_COM,
    inputs: [
      {
        key: 'apiKey',
        label: 'API Key',
        placeholder: 'Enter API key',
        type: 'text',
      },
      {
        key: 'secretKey',
        label: 'Secret Key',
        placeholder: 'Enter secret key',
        type: 'text',
      },
      {
        key: 'expiresAt',
        label: 'Expires',
        placeholder: 'Select expire date of API keys',
        type: 'date',
      },
    ],
  },
  [BrokerName.CAPITAL_COM]: {
    id: BrokerName.CAPITAL_COM,
    name: BrokerName.CAPITAL_COM,
    inputs: [
      {
        key: 'apiKey',
        label: 'API Key',
        placeholder: 'Enter API key',
        type: 'text',
      },
      {
        key: 'expiresAt',
        label: 'Expires',
        placeholder: 'Select expire date of API key',
        type: 'date',
      }
    ],
  },
};

export const botCreateConfigs: { [p in BrokerName]: BotCreateConfig } = {
  [BrokerName.CURRENCY_COM]: {
    brokerName: BrokerName.CURRENCY_COM,
    allowDemoAccount: false,
    allowLeverageSettings: true,
  },
  [BrokerName.CAPITAL_COM]: {
    brokerName: BrokerName.CURRENCY_COM,
    allowDemoAccount: true,
    allowLeverageSettings: false,
  },
};

export const botCreateSettings = {
  riskInput: {
    label: 'Risk',
    type: 'number',
    numberSuffix: ' %',
    numberMin: botDefaultSettings.tradeRiskPercent.min,
    numberMax: botDefaultSettings.tradeRiskPercent.max,
    numberMinFractionDigits: 2,
    numberMaxFractionDigits: 2,
    numberUseSlider: true,
    numberSliderStep: 0.25,
  },
  maxLossInput: {
    label: 'Max loss',
    type: 'number',
    tooltip: 'Percent of broker account capital loss before bot stopped',
    helpText: 'Used to control losses. Value of initial capital will reset after each activation or update of dependent settings',
    numberSuffix: ' %',
    numberMin: botDefaultSettings.tradeMaxLossPercent.min,
    numberMax: botDefaultSettings.tradeMaxLossPercent.max,
    numberUseSlider: true,
    numberSliderStep: 5,
  },
  capitalInput: {
    label: 'Capital use',
    type: 'number',
    tooltip: 'Percent of broker account capital use for current bot',
    numberSuffix: ' %',
  },
  capitalPanelInput: {
    type: 'number',
    numberSuffix: ' %',
    numberMin: botDefaultSettings.tradeCapitalPercent.min,
    numberUseSlider: true,
    numberSliderStep: 5,
  },
  takeProfitInput: {
    label: 'Take profit',
    type: 'number',
    numberSuffix: ' pl',
    numberMin: botDefaultSettings.tradeTakeProfitPL.min,
    numberMax: botDefaultSettings.tradeTakeProfitPL.max,
    numberMinFractionDigits: 2,
    numberMaxFractionDigits: 2,
    numberUseSlider: true,
    numberSliderStep: 0.5,
  },
  restartMode: {
    helpText: 'Note that restart will always be on saturday at 01:00',
    options: [
      {
        mode: BotRestartMode.WEEK,
        label: 'Every week'
      },
      {
        mode: BotRestartMode.MONTH,
        label: 'Every month (4 weeks)'
      },
    ],
  },
  positionCloseMode: {
    options: [
      {
        mode: BotPositionCloseMode.DAY_END,
        label: 'At the end of the trading day'
      },
      {
        mode: BotPositionCloseMode.WEEK_END,
        label: 'At the end of the trading week'
      },
    ],
  },
};
