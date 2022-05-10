import { BrokerName } from 'global/constants';


export const botDefaultSettings = {
  tradeRiskPercent: {
    min: 1,
    max: 5,
  },
  tradeMaxLossPercent: {
    min: 10,
    max: 50,
  },
  tradeCapitalPercent: {
    min: 10,
    max: 100,
  },
  tradeTakeProfitPL: {
    min: 1,
    max: 10,
  },
};

export const brokerConfigs = {
  [BrokerName.CAPITAL_COM]: {
    label: 'Capital.com',
    logo: '/images/capital-com-logo.jpeg',
  },
  [BrokerName.CURRENCY_COM]: {
    label: 'Currency.com',
    logo: '/images/currency-com-logo.png',
  },
};
