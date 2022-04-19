import type { BrokerClientInfo, ErrorItem } from 'global/types';
import { ActionSectionComponent } from 'shared/constants';


export interface StoreState {
  isAppMenuOpen: boolean;
  isActionSectionActive: boolean;
  actionSectionComponent: ActionSectionComponent;
  notification: null | StoreNotification;
  errors: { [p: string]: ErrorItem[]; };
  user: {
    brokers: BrokerClientInfo[];
  };
}

export type StoreNotification = {
  severity: 'success' | 'info' | 'error';
  summary: string;
  detail: string;
  life: number;
  group: 'notification';
}

export interface StoreService {
  setError(key: string, errors: ErrorItem[]): void;
}
