import type { BrokerAccount } from 'global/types';
import { BrokerAccountType, BrokerName } from 'global/constants';


export type InputState = {
  value: InputValue;
  helpText: string;
  isError: boolean;
}

export type InputValue = string | number | Date | null;

export type InputConfig = {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date';
}

export type DropdownBrokerOption = {
  id: string;
  brokerName: BrokerName;
  status?: string;
  statusTooltip?: string;
}

export type DropdownBrokerAccountOption = {
  label: BrokerAccountType;
  items: BrokerAccount[];
}
