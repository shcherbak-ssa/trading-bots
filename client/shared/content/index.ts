import { BrokerName } from 'global/constants';

import type { AppMenuItem, Broker } from 'shared/types';
import { IconList, Route } from 'shared/constants';


export const appMenuItems: AppMenuItem[] = [
  {
    label: 'Dashboard',
    icon: IconList.DASHBOARD,
    to: Route.DASHBOARD,
  },
  {
    label: 'Bots',
    icon: IconList.BOTS,
    to: Route.BOTS,
  },
  {
    label: 'Analytics',
    icon: IconList.ANALYTICS,
    to: Route.ANALYTICS,
  },
  {
    label: 'Settings',
    icon: IconList.SETTINGS,
    to: Route.SETTINGS,
  },
];

export const brokerList: Broker[] = [
  {
    name: BrokerName.CURRENCY_COM,
    label: 'Currency.com',
    logo: '/images/currency-com-logo.png',
    inputs: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'text',
      },
      {
        key: 'secretKey',
        label: 'Secret Key',
        type: 'text',
      },
      {
        key: 'expiresDate',
        label: 'Expires',
        type: 'date',
      },
    ],
  },
  {
    name: BrokerName.CAPITAL_COM,
    label: 'Capital.com',
    logo: '/images/capital-com-logo.jpeg',
    inputs: [
      {
        key: 'apiKey',
        label: 'API Key',
        type: 'text',
      },
      {
        key: 'expiresDate',
        label: 'Expires',
        type: 'date',
      }
    ],
  },
];
